jQuery(document).ready(function($) {
    'use strict';

    // Enhanced PopupManager with jQuery Deferred support
    const PopupManager = {
        activePopups: new Set(),
        scrollPosition: 0,
        exitIntentTriggered: false,
        deferredOperations: {},
        
        init: function() {
            this.setupDeferredHelpers();
            this.bindEvents();
            this.initializePopups();
        },
        
        // Setup jQuery Deferred helper methods
        setupDeferredHelpers: function() {
            // Create animation promise helpers
            $.fn.animateWithPromise = function(properties, duration, easing) {
                const deferred = $.Deferred();
                
                this.animate(properties, {
                    duration: duration || 400,
                    easing: easing || 'swing',
                    complete: () => deferred.resolve(this),
                    fail: () => deferred.reject(this)
                });
                
                return deferred.promise();
            };
            
            // CSS transition promise helper
            $.fn.transitionWithPromise = function(className, duration) {
                const deferred = $.Deferred();
                
                this.addClass(className);
                setTimeout(() => deferred.resolve(this), duration || 300);
                
                return deferred.promise();
            };
        },
        
        bindEvents: function() {
            $(document).on('click', '.dicm-popup-trigger', (e) => {
                e.preventDefault();
                const popupId = $(e.currentTarget).data('popup-id');
                if (popupId) {
                    this.openPopup(popupId);
                }
            });
            
            $(document).on('click', '.dicm-popup-close', (e) => {
                e.preventDefault();
                const $popup = $(e.currentTarget).closest('.dicm-popup-overlay');
                this.closePopup($popup.attr('id'));
            });
            
            $(document).on('click', '.dicm-popup-overlay', (e) => {
                if (e.target === e.currentTarget) {
                    const $popup = $(e.currentTarget);
                    const config = $popup.data('config');
                    if (config && config.close_on_overlay) {
                        this.closePopup($popup.attr('id'));
                    }
                }
            });
            
            $(document).on('keydown', (e) => {
                if (e.key === 'Escape' && this.activePopups.size > 0) {
                    const popupId = Array.from(this.activePopups).pop();
                    const $popup = $('#' + popupId);
                    const config = $popup.data('config');
                    if (config && config.close_on_escape) {
                        this.closePopup(popupId);
                    }
                }
            });
        },
        
        initializePopups: function() {
            $('.dicm-popup-overlay').each((index, element) => {
                const $popup = $(element);
                const config = $popup.data('config');
                const popupId = $popup.attr('id');
                
                if (!config || !popupId) return;
                
                switch (config.trigger_type) {
                    case 'page_load':
                        this.schedulePopup(popupId, 100);
                        break;
                    case 'time_delay':
                        this.schedulePopup(popupId, config.delay_time * 1000);
                        break;
                    case 'scroll':
                        this.setupScrollTrigger(popupId, config.scroll_percentage);
                        break;
                    case 'exit_intent':
                        this.setupExitIntentTrigger(popupId);
                        break;
                }
            });
        },
        
        // Enhanced popup opening with jQuery Deferred
        openPopup: function(popupId) {
            const deferred = $.Deferred();
            const $popup = $('#' + popupId);
            
            if (!$popup.length || this.activePopups.has(popupId)) {
                return deferred.reject('Popup not found or already open').promise();
            }
            
            const config = $popup.data('config');
            
            // Store scroll position if needed
            if (config && config.prevent_scroll) {
                this.scrollPosition = $(window).scrollTop();
                $('body').addClass('dicm-popup-open').css('top', -this.scrollPosition);
            }
            
            this.activePopups.add(popupId);
            
            // Animation sequence using jQuery Deferred
            $popup.show().css({ opacity: 0, transform: 'scale(0.8)' });
            
            $.when(
                $popup.transitionWithPromise('active', 50),
                $popup.animateWithPromise({ opacity: 1 }, 300)
            ).then(() => {
                // Focus management
                this.manageFocus($popup, 'open');
                
                // Setup auto-close
                const autoCloseDelay = $popup.data('auto-close-delay');
                if (autoCloseDelay > 0) {
                    setTimeout(() => this.closePopup(popupId), autoCloseDelay * 1000);
                }
                
                // Trigger events
                $(document).trigger('dicm_popup_opened', [popupId, $popup]);
                this.trackPopupEvent('opened', popupId);
                
                deferred.resolve($popup);
            }).catch(() => {
                this.activePopups.delete(popupId);
                $popup.hide();
                deferred.reject('Animation failed');
            });
            
            return deferred.promise();
        },
        
        // Enhanced popup closing with jQuery Deferred
        closePopup: function(popupId) {
            const deferred = $.Deferred();
            const $popup = $('#' + popupId);
            
            if (!$popup.length || !this.activePopups.has(popupId)) {
                return deferred.reject('Popup not found or not open').promise();
            }
            
            const config = $popup.data('config');
            this.activePopups.delete(popupId);
            
            // Close animation sequence
            $.when(
                $popup.animateWithPromise({ opacity: 0 }, 200),
                $popup.removeClass('active')
            ).then(() => {
                return $popup.fadeOut(100);
            }).then(() => {
                // Restore scroll if needed
                if (this.activePopups.size === 0 && config && config.prevent_scroll) {
                    $('body').removeClass('dicm-popup-open').css('top', '');
                    $(window).scrollTop(this.scrollPosition);
                }
                
                this.manageFocus($popup, 'close');
                $(document).trigger('dicm_popup_closed', [popupId, $popup]);
                this.trackPopupEvent('closed', popupId);
                
                deferred.resolve($popup);
            }).catch(() => {
                deferred.reject('Animation failed');
            });
            
            return deferred.promise();
        },
        
        // Chain multiple popup operations
        chainOperations: function(operations) {
            let chain = $.Deferred().resolve().promise();
            
            operations.forEach(operation => {
                chain = chain.then(() => {
                    switch(operation.type) {
                        case 'open':
                            return this.openPopup(operation.popupId);
                        case 'close':
                            return this.closePopup(operation.popupId);
                        case 'delay':
                            const delayDeferred = $.Deferred();
                            setTimeout(() => delayDeferred.resolve(), operation.duration || 1000);
                            return delayDeferred.promise();
                        default:
                            return $.Deferred().resolve().promise();
                    }
                });
            });
            
            return chain;
        },
        
        // Open popup with condition check
        openConditional: function(popupId, conditionFn) {
            const deferred = $.Deferred();
            
            try {
                const result = conditionFn();
                if (result === true || (result && typeof result.then === 'function')) {
                    $.when(result).then(() => {
                        this.openPopup(popupId).then(deferred.resolve, deferred.reject);
                    });
                } else {
                    deferred.reject('Condition not met');
                }
            } catch (error) {
                deferred.reject('Condition check failed: ' + error.message);
            }
            
            return deferred.promise();
        },
        
        schedulePopup: function(popupId, delay) {
            setTimeout(() => this.openPopup(popupId), delay);
        },
        
        setupScrollTrigger: function(popupId, percentage) {
            $(window).on('scroll.popup-' + popupId, $.throttle(100, () => {
                const scrollPercent = ($(window).scrollTop() / ($(document).height() - $(window).height())) * 100;
                if (scrollPercent >= percentage && !this.activePopups.has(popupId)) {
                    this.openPopup(popupId);
                    $(window).off('scroll.popup-' + popupId);
                }
            }));
        },
        
        setupExitIntentTrigger: function(popupId) {
            $(document).on('mouseleave.popup-' + popupId, (e) => {
                if (e.clientY <= 0 && !this.exitIntentTriggered) {
                    this.exitIntentTriggered = true;
                    this.openPopup(popupId);
                    $(document).off('mouseleave.popup-' + popupId);
                }
            });
        },
        
        manageFocus: function($popup, action) {
            if (action === 'open') {
                $popup.data('previous-focus', document.activeElement);
                const $firstFocusable = $popup.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
                if ($firstFocusable.length) {
                    $firstFocusable.focus();
                }
            } else if (action === 'close') {
                const previousFocus = $popup.data('previous-focus');
                if (previousFocus && $(previousFocus).length) {
                    $(previousFocus).focus();
                }
            }
        },
        
        trackPopupEvent: function(action, popupId) {
            // Google Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'popup_' + action, { popup_id: popupId });
            }
            
            // Facebook Pixel
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'Popup' + action.charAt(0).toUpperCase() + action.slice(1), { popup_id: popupId });
            }
        },
        
        // Public API methods
        openById: function(popupId) {
            return this.openPopup(popupId);
        },
        
        closeById: function(popupId) {
            return this.closePopup(popupId);
        },
        
        closeAll: function() {
            const closePromises = Array.from(this.activePopups).map(popupId => this.closePopup(popupId));
            return $.when.apply($, closePromises);
        }
    };
    
    // Initialize popup manager
    PopupManager.init();
    
    // Make PopupManager globally accessible
    window.DICMPopupManager = PopupManager;
    
    // jQuery throttle utility
    if (!$.throttle) {
        $.throttle = function(delay, fn) {
            let timeoutId;
            let lastExec = 0;
            
            return function() {
                const context = this;
                const args = arguments;
                const elapsed = Date.now() - lastExec;
                
                const exec = function() {
                    lastExec = Date.now();
                    fn.apply(context, args);
                };
                
                clearTimeout(timeoutId);
                
                if (elapsed > delay) {
                    exec();
                } else {
                    timeoutId = setTimeout(exec, delay - elapsed);
                }
            };
        };
    }
    
    // Example usage with jQuery Deferred:
    /*
    // Open popup and wait for it to complete
    DICMPopupManager.openById('my-popup').then(function($popup) {
        console.log('Popup opened successfully', $popup);
    }).catch(function(error) {
        console.log('Failed to open popup', error);
    });
    
    // Chain multiple operations
    DICMPopupManager.chainOperations([
        { type: 'open', popupId: 'popup1' },
        { type: 'delay', duration: 2000 },
        { type: 'close', popupId: 'popup1' },
        { type: 'open', popupId: 'popup2' }
    ]).then(function() {
        console.log('All operations completed');
    });
    
    // Open popup conditionally
    DICMPopupManager.openConditional('my-popup', function() {
        return localStorage.getItem('user_logged_in') === 'true';
    }).then(function($popup) {
        console.log('Conditional popup opened');
    });
    */
    
});

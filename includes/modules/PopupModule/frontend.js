jQuery(document).ready(function($) {
    'use strict';

    // Initialize popup system with jQuery Deferred support
    const PopupManager = {
        activePopups: new Set(),
        scrollPosition: 0,
        exitIntentTriggered: false,
        animationQueue: {},
        deferredOperations: {},
        
        init: function() {
            this.setupDeferredHelpers();
            this.bindEvents();
            this.initializePopups();
        },
        
        // Setup jQuery Deferred helper methods
        setupDeferredHelpers: function() {
            const self = this;
            
            // Create animation promise helpers
            $.fn.animateWithDeferred = function(properties, duration, easing) {
                const deferred = $.Deferred();
                const $this = this;
                
                $this.animate(properties, {
                    duration: duration || 400,
                    easing: easing || 'swing',
                    complete: function() {
                        deferred.resolve($this);
                    },
                    fail: function() {
                        deferred.reject($this);
                    }
                });
                
                return deferred.promise();
            };
            
            // CSS transition promise helper
            $.fn.transitionWithDeferred = function(className, duration) {
                const deferred = $.Deferred();
                const $this = this;
                const transitionDuration = duration || 300;
                
                $this.addClass(className);
                
                setTimeout(() => {
                    deferred.resolve($this);
                }, transitionDuration);
                
                return deferred.promise();
            };
            
            // Popup-specific deferred operations
            this.deferredOperations = {
                opening: {},
                closing: {},
                animations: {}
            };
        },
        
        // Create a deferred popup opening operation
        createOpenDeferred: function(popupId) {
            if (!this.deferredOperations.opening[popupId]) {
                this.deferredOperations.opening[popupId] = $.Deferred();
            }
            return this.deferredOperations.opening[popupId];
        },
        
        // Create a deferred popup closing operation
        createCloseDeferred: function(popupId) {
            if (!this.deferredOperations.closing[popupId]) {
                this.deferredOperations.closing[popupId] = $.Deferred();
            }
            return this.deferredOperations.closing[popupId];
        },
        },
        
        bindEvents: function() {
            // Button trigger events
            $(document).on('click', '.dicm-popup-trigger', this.handleButtonTrigger.bind(this));            // Close button events
            $(document).on('click', '.dicm-popup-close', this.handleCloseButton.bind(this));
            
            // Overlay click events
            $(document).on('click', '.dicm-popup-overlay', this.handleOverlayClick.bind(this));
            
            // Prevent clicks on popup content from closing popup
            $(document).on('click', '.dicm-popup-content', function(e) {
                e.stopPropagation();
            });
            
            // Keyboard events
            $(document).on('keydown', this.handleKeyboard.bind(this));
            
            // Scroll events for scroll-triggered popups
            $(window).on('scroll', $.throttle(100, this.handleScroll.bind(this)));
            
            // Exit intent events
            $(document).on('mouseleave', this.handleExitIntent.bind(this));
            
            // Window resize events
            $(window).on('resize', $.throttle(250, this.handleResize.bind(this)));
        },
        
        initializePopups: function() {
            $('.dicm-popup-overlay').each((index, element) => {
                const $popup = $(element);
                const config = $popup.data('config');
                const popupId = $popup.attr('id');
                
                if (!config || !popupId) return;
                
                // Initialize popup based on trigger type
                switch (config.trigger_type) {
                    case 'page_load':
                        this.schedulePageLoadPopup(popupId);
                        break;
                    case 'time_delay':
                        this.scheduleTimeDelayPopup(popupId, config.delay_time);
                        break;
                    case 'scroll':
                        this.setupScrollTrigger(popupId, config.scroll_percentage);
                        break;
                    case 'exit_intent':
                        this.setupExitIntentTrigger(popupId);
                        break;
                }
                
                // Setup auto-close if enabled
                if (config.auto_close > 0) {
                    this.setupAutoClose(popupId, config.auto_close);
                }
            });
        },
        
        handleButtonTrigger: function(e) {
            e.preventDefault();
            const popupId = $(e.currentTarget).data('popup-id');
            if (popupId) {
                this.openPopup(popupId);
            }
        },
        
        handleCloseButton: function(e) {
            e.preventDefault();
            const $popup = $(e.currentTarget).closest('.dicm-popup-overlay');
            this.closePopup($popup.attr('id'));
        },
        
        handleOverlayClick: function(e) {
            if (e.target === e.currentTarget) {
                const $popup = $(e.currentTarget);
                const config = $popup.data('config');
                
                if (config && config.close_on_overlay) {
                    this.closePopup($popup.attr('id'));
                }
            }
        },
        
        handleKeyboard: function(e) {
            if (e.key === 'Escape' && this.activePopups.size > 0) {
                // Close the most recently opened popup
                const popupId = Array.from(this.activePopups).pop();
                const $popup = $('#' + popupId);
                const config = $popup.data('config');
                
                if (config && config.close_on_escape) {
                    this.closePopup(popupId);
                }
            }
            
            // Handle Tab key for focus management
            if (e.key === 'Tab' && this.activePopups.size > 0) {
                this.handleTabKey(e);
            }
        },
        
        handleTabKey: function(e) {
            const popupId = Array.from(this.activePopups).pop();
            const $popup = $('#' + popupId);
            const $focusableElements = $popup.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            if ($focusableElements.length === 0) return;
            
            const firstElement = $focusableElements[0];
            const lastElement = $focusableElements[$focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        },
        
        handleScroll: function() {
            const scrollTop = $(window).scrollTop();
            const documentHeight = $(document).height();
            const windowHeight = $(window).height();
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            
            $('.dicm-popup-overlay[data-scroll-trigger]').each((index, element) => {
                const $popup = $(element);
                const triggerPercent = $popup.data('scroll-trigger');
                
                if (scrollPercent >= triggerPercent && !this.activePopups.has($popup.attr('id'))) {
                    this.openPopup($popup.attr('id'));
                    $popup.removeAttr('data-scroll-trigger'); // Prevent multiple triggers
                }
            });
        },
        
        handleExitIntent: function(e) {
            if (e.clientY <= 0 && !this.exitIntentTriggered) {
                this.exitIntentTriggered = true;
                
                $('.dicm-popup-overlay[data-exit-intent="true"]').each((index, element) => {
                    const $popup = $(element);
                    if (!this.activePopups.has($popup.attr('id'))) {
                        this.openPopup($popup.attr('id'));
                        $popup.removeAttr('data-exit-intent'); // Prevent multiple triggers
                    }
                });
            }
        },
        
        handleResize: function() {
            // Reposition popups if needed
            this.activePopups.forEach(popupId => {
                this.repositionPopup(popupId);
            });
        },
        
        schedulePageLoadPopup: function(popupId) {
            // Small delay to ensure page is fully loaded
            setTimeout(() => {
                this.openPopup(popupId);
            }, 100);
        },
        
        scheduleTimeDelayPopup: function(popupId, delay) {
            setTimeout(() => {
                if (!this.activePopups.has(popupId)) {
                    this.openPopup(popupId);
                }
            }, delay * 1000);
        },
        
        setupScrollTrigger: function(popupId, percentage) {
            $('#' + popupId).attr('data-scroll-trigger', percentage);
        },
        
        setupExitIntentTrigger: function(popupId) {
            $('#' + popupId).attr('data-exit-intent', 'true');
        },
        
        setupAutoClose: function(popupId, delay) {
            // This will be called when popup opens
            $('#' + popupId).data('auto-close-delay', delay);
        },
        
        // Enhanced popup opening with jQuery Deferred
        openPopup: function(popupId) {
            const $popup = $('#' + popupId);
            if (!$popup.length || this.activePopups.has(popupId)) {
                return $.Deferred().reject().promise();
            }
            
            const deferred = this.createOpenDeferred(popupId);
            const config = $popup.data('config');
            
            // Store scroll position if scroll prevention is enabled
            if (config && config.prevent_scroll) {
                this.scrollPosition = $(window).scrollTop();
                $('body').addClass('dicm-popup-open').css('top', -this.scrollPosition);
            }
            
            // Add to active popups
            this.activePopups.add(popupId);
            
            // Position the popup properly
            this.repositionPopup(popupId);
            
            // Chain animations using jQuery Deferred
            $popup.show()
                .css({ opacity: 0, transform: 'scale(0.8)' })
                .transitionWithDeferred('active', 50)
                .then(() => {
                    return $popup.animateWithDeferred({ 
                        opacity: 1,
                        transform: 'scale(1)'
                    }, 300, 'easeOutBack');
                })
                .then(() => {
                    // Focus management
                    this.manageFocus($popup, 'open');
                    
                    // Setup auto-close if configured
                    const autoCloseDelay = $popup.data('auto-close-delay');
                    if (autoCloseDelay > 0) {
                        setTimeout(() => {
                            this.closePopup(popupId);
                        }, autoCloseDelay * 1000);
                    }
                    
                    // Trigger custom event
                    $(document).trigger('dicm_popup_opened', [popupId, $popup]);
                    
                    // Analytics tracking
                    this.trackPopupEvent('opened', popupId);
                    
                    // Resolve the deferred
                    deferred.resolve($popup);
                })
                .catch(() => {
                    // Handle animation failure
                    this.activePopups.delete(popupId);
                    $popup.hide();
                    deferred.reject();
                });
            
            return deferred.promise();
        },
        
        // Enhanced popup closing with jQuery Deferred
        closePopup: function(popupId) {
            const $popup = $('#' + popupId);
            if (!$popup.length || !this.activePopups.has(popupId)) {
                return $.Deferred().reject().promise();
            }
            
            const deferred = this.createCloseDeferred(popupId);
            const config = $popup.data('config');
            
            // Remove from active popups
            this.activePopups.delete(popupId);
            
            // Chain close animations using jQuery Deferred
            $popup.animateWithDeferred({ 
                opacity: 0,
                transform: 'scale(0.8)'
            }, 200, 'easeInBack')
                .then(() => {
                    $popup.removeClass('active');
                    return $.when($popup.fadeOut(100));
                })
                .then(() => {
                    // Restore scroll if this was the last popup and scroll prevention is enabled
                    if (this.activePopups.size === 0 && config && config.prevent_scroll) {
                        $('body').removeClass('dicm-popup-open').css('top', '');
                        $(window).scrollTop(this.scrollPosition);
                    }
                    
                    // Focus management
                    this.manageFocus($popup, 'close');
                    
                    // Trigger custom event
                    $(document).trigger('dicm_popup_closed', [popupId, $popup]);
                    
                    // Analytics tracking
                    this.trackPopupEvent('closed', popupId);
                    
                    // Resolve the deferred
                    deferred.resolve($popup);
                    
                    // Clean up deferred operations
                    delete this.deferredOperations.opening[popupId];
                    delete this.deferredOperations.closing[popupId];
                })
                .catch(() => {
                    deferred.reject();
                });
            
            return deferred.promise();
        },
        
        // Enhanced method to open popup with promise support
        openPopupWithPromise: function(popupId) {
            return this.openPopup(popupId);
        },
        
        // Enhanced method to close popup with promise support
        closePopupWithPromise: function(popupId) {
            return this.closePopup(popupId);
        },
        
        // Method to chain multiple popup operations
        chainPopupOperations: function(operations) {
            let chain = $.Deferred().resolve();
            
            operations.forEach(operation => {
                chain = chain.then(() => {
                    switch(operation.type) {
                        case 'open':
                            return this.openPopup(operation.popupId);
                        case 'close':
                            return this.closePopup(operation.popupId);
                        case 'delay':
                            const deferred = $.Deferred();
                            setTimeout(() => deferred.resolve(), operation.duration || 1000);
                            return deferred.promise();
                        default:
                            return $.Deferred().resolve().promise();
                    }
                });
            });
            
            return chain;
        },
        
        // Method to open popup with conditional logic
        openPopupConditional: function(popupId, condition) {
            const deferred = $.Deferred();
            
            if (typeof condition === 'function') {
                const result = condition();
                if (result === true || (result && typeof result.then === 'function')) {
                    $.when(result).then(() => {
                        this.openPopup(popupId).then(deferred.resolve, deferred.reject);
                    }).catch(deferred.reject);
                } else {
                    deferred.reject('Condition not met');
                }
            } else if (condition) {
                this.openPopup(popupId).then(deferred.resolve, deferred.reject);
            } else {
                deferred.reject('Condition not met');
            }
            
            return deferred.promise();
        },
        
        manageFocus: function($popup, action) {
            if (action === 'open') {
                // Store currently focused element
                $popup.data('previous-focus', document.activeElement);
                
                // Focus first focusable element in popup
                const $firstFocusable = $popup.find('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])').first();
                if ($firstFocusable.length) {
                    $firstFocusable.focus();
                } else {
                    $popup.find('.dicm-popup-content').focus();
                }
            } else if (action === 'close') {
                // Restore focus to previously focused element
                const previousFocus = $popup.data('previous-focus');
                if (previousFocus && $(previousFocus).length) {
                    $(previousFocus).focus();
                }
            }
        },
        
        repositionPopup: function(popupId) {
            const $popup = $('#' + popupId);
            const $container = $popup.find('.dicm-popup-container');
            const $content = $popup.find('.dicm-popup-content');
            
            if (!$popup.length || !$container.length) return;
            
            // Get popup configuration
            const config = $popup.data('config') || {};
            const position = config.popup_position || 'center';
            const width = config.popup_width || '600px';
            const height = config.popup_height || 'auto';
            
            // Reset any previous positioning
            $container.css({
                'margin-top': '',
                'margin-left': '',
                'transform-origin': 'center center'
            });
            
            $content.css({
                'width': width,
                'height': height === 'custom' ? (config.popup_custom_height || '400px') : height
            });
            
            // Apply position-specific adjustments
            $popup.removeClass('dicm-popup-pos-center dicm-popup-pos-top_left dicm-popup-pos-top_center dicm-popup-pos-top_right dicm-popup-pos-center_left dicm-popup-pos-center_right dicm-popup-pos-bottom_left dicm-popup-pos-bottom_center dicm-popup-pos-bottom_right');
            $popup.addClass('dicm-popup-pos-' + position);
            
            // Handle responsive adjustments
            const windowWidth = $(window).width();
            const windowHeight = $(window).height();
            const contentWidth = parseInt(width);
            const contentHeight = height === 'auto' ? $content.outerHeight() : parseInt(height === 'custom' ? config.popup_custom_height : height);
            
            // Ensure popup fits within viewport
            if (contentWidth > windowWidth * 0.9) {
                $content.css('width', '90vw');
            }
            
            if (contentHeight > windowHeight * 0.9) {
                $content.css('height', '90vh');
            }
            
            // Center transform origin for better scaling
            const centerX = windowWidth / 2;
            const centerY = windowHeight / 2;
            
            if (position === 'center') {
                $container.css('transform-origin', 'center center');
            } else if (position.includes('top')) {
                $container.css('transform-origin', 'center top');
            } else if (position.includes('bottom')) {
                $container.css('transform-origin', 'center bottom');
            }
            
            // Force reflow to ensure positioning is applied
            $container[0].offsetHeight;
        },
        
        trackPopupEvent: function(action, popupId) {
            // Google Analytics tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'popup_' + action, {
                    'popup_id': popupId
                });
            }
            
            // Facebook Pixel tracking
            if (typeof fbq !== 'undefined') {
                fbq('trackCustom', 'Popup' + action.charAt(0).toUpperCase() + action.slice(1), {
                    popup_id: popupId
                });
            }
        },
        
        // Public API methods
        openPopupById: function(popupId) {
            this.openPopup(popupId);
        },
        
        closePopupById: function(popupId) {
            this.closePopup(popupId);
        },
        
        closeAllPopups: function() {
            this.activePopups.forEach(popupId => {
                this.closePopup(popupId);
            });
        }
    };
    
    // Initialize popup manager
    PopupManager.init();
    
    // Make PopupManager globally accessible
    window.DICMPopupManager = PopupManager;
    
    // jQuery throttle utility (if not already available)
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
    
    // Touch support for mobile devices
    if ('ontouchstart' in window) {
        $(document).on('touchend', '.dicm-popup-trigger', function(e) {
            // Ensure touch events work properly on mobile
            $(this).trigger('click');
        });
    }
    
    // Handle Visual Builder integration
    if (window.et_builder_api_ready !== undefined) {
        $(window).on('et_builder_api_ready', function() {
            // Disable popup triggers in Visual Builder
            $('.dicm-popup-overlay').removeClass('active').hide();
        });
    }
    
    // Accessibility improvements
    $(document).on('focus', '.dicm-popup-content', function() {
        $(this).attr('tabindex', '-1');
    });
    
    // Handle page visibility changes
    $(document).on('visibilitychange', function() {
        if (document.hidden) {
            // Pause any timers when page is not visible
            PopupManager.activePopups.forEach(popupId => {
                const $popup = $('#' + popupId);
                $popup.addClass('paused');
            });
        } else {
            // Resume when page becomes visible
            PopupManager.activePopups.forEach(popupId => {
                const $popup = $('#' + popupId);
                $popup.removeClass('paused');
            });
        }
    });
});

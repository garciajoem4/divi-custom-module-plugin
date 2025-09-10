jQuery(document).ready(function($) {
    'use strict';

    // Safari-specific AWeber form compatibility fixes
    function initSafariCompatibility() {
        // Check if we're in Safari
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isSafari) {
            console.log('Safari detected - applying AWeber form compatibility fixes');
            
            // Force Safari to properly render AWeber forms
            setTimeout(function() {
                $('.dicm-aweber-embed-container div[class*="AW-Form"]').each(function() {
                    const $form = $(this);
                    
                    // Force layout recalculation
                    $form.css('display', 'none').height();
                    $form.css('display', 'block');
                    
                    // Ensure proper width calculation
                    $form.css({
                        'width': '100%',
                        'max-width': '100%',
                        'box-sizing': 'border-box',
                        'position': 'relative'
                    });
                    
                    // Fix input fields
                    $form.find('input, select, textarea, button').each(function() {
                        const $input = $(this);
                        
                        // Apply Safari-specific fixes
                        $input.css({
                            '-webkit-appearance': $input.is('button, input[type="submit"], input[type="button"]') ? 'button' : 'none',
                            'appearance': $input.is('button, input[type="submit"], input[type="button"]') ? 'button' : 'none',
                            'box-sizing': 'border-box',
                            'max-width': '100%'
                        });
                        
                        // Prevent iOS Safari zoom on input focus
                        if ($input.is('input[type="text"], input[type="email"], input[type="tel"], textarea')) {
                            const currentFontSize = $input.css('font-size');
                            const fontSize = parseInt(currentFontSize);
                            if (fontSize < 16) {
                                $input.css('font-size', '16px');
                            }
                        }
                    });
                });
            }, 100);
            
            // Re-apply fixes after AWeber script loads
            setTimeout(function() {
                $('.dicm-aweber-embed-container div[class*="AW-Form"]').each(function() {
                    const $form = $(this);
                    
                    // Check if AWeber form is now loaded
                    if ($form.children().length > 0) {
                        console.log('AWeber form loaded - reapplying Safari fixes');
                        
                        // Reapply styles after AWeber loads
                        $form.css({
                            'width': '100% !important',
                            'max-width': '100% !important'
                        });
                        
                        // Fix any newly added inputs
                        $form.find('input, select, textarea, button').each(function() {
                            const $input = $(this);
                            $input.css({
                                '-webkit-appearance': $input.is('button, input[type="submit"], input[type="button"]') ? 'button' : 'none',
                                'appearance': $input.is('button, input[type="submit"], input[type="button"]') ? 'button' : 'none'
                            });
                        });
                    }
                });
            }, 1000);
            
            // Additional check after 3 seconds
            setTimeout(function() {
                $('.dicm-aweber-embed-container div[class*="AW-Form"]').each(function() {
                    const $form = $(this);
                    if ($form.children().length > 0) {
                        // Force a final layout recalculation
                        $form.hide().show();
                    }
                });
            }, 3000);
        }
    }

    // Initialize Safari compatibility on page load
    initSafariCompatibility();
    
    // Reinitialize if page content changes (for AJAX loaded content)
    if (window.MutationObserver) {
        const observer = new MutationObserver(function(mutations) {
            let shouldRecheck = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && 
                            (node.classList && node.classList.contains('dicm-aweber-embed-container')) ||
                            (node.querySelector && node.querySelector('.dicm-aweber-embed-container'))) {
                            shouldRecheck = true;
                        }
                    });
                }
            });
            
            if (shouldRecheck) {
                setTimeout(initSafariCompatibility, 100);
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Handle Divi Visual Builder
    if (window.et_pb) {
        $(document).on('et_pb_after_init_modules', function() {
            setTimeout(initSafariCompatibility, 500);
        });
    }
});

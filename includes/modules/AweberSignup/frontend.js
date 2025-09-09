jQuery(document).ready(function($) {
    'use strict';

    // Handle AWeber form submission
    $(document).on('submit', '.dicm-aweber-form', function(e) {
        e.preventDefault();
        
        const $form = $(this);
        const $container = $form.closest('.dicm-aweber-container');
        const $submitBtn = $form.find('.dicm-aweber-submit');
        const $messages = $container.find('.dicm-aweber-messages');
        const $success = $messages.find('.dicm-aweber-success');
        const $error = $messages.find('.dicm-aweber-error');
        const $loading = $messages.find('.dicm-aweber-loading');

        // Get form data
        const formData = {
            action: 'dicm_aweber_submit',
            subscriber_email: $form.find('input[name="subscriber_email"]').val(),
            subscriber_name: $form.find('input[name="subscriber_name"]').val() || '',
            aweber_list_id: $form.find('input[name="aweber_list_id"]').val(),
            aweber_authorization_code: $form.find('input[name="aweber_authorization_code"]').val(),
            redirect_url: $form.find('input[name="redirect_url"]').val() || '',
            gdpr_consent: $form.find('input[name="gdpr_consent"]').is(':checked') ? '1' : '0',
            nonce: $form.find('input[name="nonce"]').val()
        };

        // Validate required fields
        if (!formData.subscriber_email) {
            showError($error, 'Please enter your email address.');
            return;
        }

        if (!isValidEmail(formData.subscriber_email)) {
            showError($error, 'Please enter a valid email address.');
            return;
        }

        // Check GDPR consent if enabled
        const $gdprCheckbox = $form.find('input[name="gdpr_consent"]');
        if ($gdprCheckbox.length && !$gdprCheckbox.is(':checked')) {
            showError($error, 'Please agree to the terms to continue.');
            return;
        }

        // Show loading state
        hideMessages($messages);
        $loading.show();
        $form.addClass('submitting');
        $submitBtn.prop('disabled', true);

        // Submit form via AJAX
        $.ajax({
            url: dicm_aweber_ajax.ajax_url,
            type: 'POST',
            data: formData,
            dataType: 'json',
            timeout: 30000,
            success: function(response) {
                if (response.success) {
                    // Show success message
                    $success.html(response.data.message || 'Thank you for subscribing!').show();
                    $form.addClass('success');
                    
                    // Reset form
                    $form[0].reset();
                    
                    // Redirect if URL provided
                    if (response.data.redirect) {
                        setTimeout(function() {
                            window.location.href = response.data.redirect;
                        }, 2000);
                    }
                    
                    // Track conversion (if Google Analytics is available)
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'conversion', {
                            'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
                        });
                    }
                    
                    // Track conversion (if Facebook Pixel is available)
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead');
                    }
                    
                } else {
                    showError($error, response.data.message || 'There was an error processing your subscription.');
                }
            },
            error: function(xhr, status, error) {
                let errorMessage = 'There was an error processing your request.';
                
                if (status === 'timeout') {
                    errorMessage = 'Request timed out. Please try again.';
                } else if (xhr.status === 429) {
                    errorMessage = 'Too many requests. Please wait a moment and try again.';
                } else if (xhr.status >= 500) {
                    errorMessage = 'Server error. Please try again later.';
                }
                
                showError($error, errorMessage);
                console.error('AWeber submission error:', error);
            },
            complete: function() {
                // Hide loading state
                $loading.hide();
                $form.removeClass('submitting');
                $submitBtn.prop('disabled', false);
            }
        });
    });

    // Real-time email validation
    $(document).on('input', '.dicm-aweber-form input[type="email"]', function() {
        const $input = $(this);
        const email = $input.val();
        
        if (email && !isValidEmail(email)) {
            $input.addClass('invalid');
        } else {
            $input.removeClass('invalid');
        }
    });

    // Handle form field focus effects
    $(document).on('focus', '.dicm-aweber-input', function() {
        $(this).closest('.dicm-aweber-field').addClass('focused');
    });

    $(document).on('blur', '.dicm-aweber-input', function() {
        $(this).closest('.dicm-aweber-field').removeClass('focused');
    });

    // Handle GDPR checkbox animation
    $(document).on('change', '.dicm-aweber-gdpr input[type="checkbox"]', function() {
        const $checkbox = $(this);
        const $gdprField = $checkbox.closest('.dicm-aweber-gdpr');
        
        if ($checkbox.is(':checked')) {
            $gdprField.addClass('agreed');
        } else {
            $gdprField.removeClass('agreed');
        }
    });

    // Utility functions
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError($errorElement, message) {
        hideMessages($errorElement.closest('.dicm-aweber-messages'));
        $errorElement.html(message).show();
        
        // Scroll to error message
        $('html, body').animate({
            scrollTop: $errorElement.offset().top - 100
        }, 300);
    }

    function hideMessages($messagesContainer) {
        $messagesContainer.find('.dicm-aweber-success, .dicm-aweber-error, .dicm-aweber-loading').hide();
    }

    // Handle keyboard navigation
    $(document).on('keydown', '.dicm-aweber-form', function(e) {
        if (e.key === 'Enter' && !$(e.target).is('textarea')) {
            const $form = $(this);
            const $inputs = $form.find('input, button');
            const currentIndex = $inputs.index(e.target);
            
            if (currentIndex < $inputs.length - 1) {
                e.preventDefault();
                $inputs.eq(currentIndex + 1).focus();
            }
        }
    });

    // Add CSS for invalid email state
    if (!$('#dicm-aweber-dynamic-styles').length) {
        $('<style id="dicm-aweber-dynamic-styles">')
            .text(`
                .dicm-aweber-input.invalid {
                    border-color: #dc3545 !important;
                    box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1) !important;
                }
                .dicm-aweber-field.focused .dicm-aweber-input {
                    transform: translateY(-1px);
                }
                .dicm-aweber-gdpr.agreed {
                    opacity: 0.8;
                }
            `)
            .appendTo('head');
    }
});

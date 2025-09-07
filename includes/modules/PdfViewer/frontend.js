// PDF Viewer Module Frontend JavaScript
jQuery(function($) {
    
    // Initialize PDF viewers when DOM is ready
    function initPdfViewers() {
        $('.dicm-pdf-viewer').each(function() {
            var $viewer = $(this);
            var $iframe = $viewer.find('iframe');
            var $object = $viewer.find('object');
            
            // Add loading indicator
            if (!$viewer.find('.dicm-pdf-loading').length) {
                $viewer.prepend('<div class="dicm-pdf-loading">Loading PDF...</div>');
            }
            
            // Handle iframe load
            $iframe.on('load', function() {
                $viewer.find('.dicm-pdf-loading').fadeOut();
                
                // Try to detect if PDF loaded successfully
                setTimeout(function() {
                    try {
                        var iframeDoc = $iframe[0].contentDocument || $iframe[0].contentWindow.document;
                        if (iframeDoc.body && iframeDoc.body.children.length === 0) {
                            // If iframe is empty, try object fallback
                            $iframe.hide();
                            $object.show();
                        }
                    } catch(e) {
                        // Cross-origin restriction, assume PDF loaded
                        console.log('PDF loaded in iframe (cross-origin)');
                    }
                }, 1000);
            });
            
            // Handle iframe error
            $iframe.on('error', function() {
                $viewer.find('.dicm-pdf-loading').fadeOut();
                $iframe.hide();
                $object.show();
            });
            
            // For mobile devices, add click to open in new tab
            if ($(window).width() <= 768) {
                $viewer.on('click', function(e) {
                    var pdfUrl = $iframe.attr('src') || $object.attr('data');
                    if (pdfUrl && !$(e.target).is('a')) {
                        window.open(pdfUrl, '_blank');
                    }
                });
                
                // Add mobile indicator
                if (!$viewer.find('.dicm-pdf-mobile-hint').length) {
                    $viewer.append('<div class="dicm-pdf-mobile-hint">Tap to open PDF in new tab</div>');
                }
            }
        });
    }
    
    // Initialize on DOM ready
    initPdfViewers();
    
    // Re-initialize when Visual Builder content changes
    $(document).on('et_builder_api_ready', function(event, API) {
        // Listen for module updates
        API.Models.PageModel.on('change', function() {
            setTimeout(initPdfViewers, 500);
        });
    });
    
    // Handle window resize
    $(window).on('resize', function() {
        $('.dicm-pdf-viewer iframe, .dicm-pdf-viewer object, .dicm-pdf-viewer embed').each(function() {
            // Force redraw on resize
            var element = this;
            element.style.display = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.display = 'block';
        });
    });
    
});

# AWeber Form Embed Module

This module allows you to easily embed AWeber forms into your Divi website using AWeber's native embed code.

## How to Use

1. **Get your AWeber embed code:**
   - Log into your AWeber account
   - Go to **Forms** → **Web Forms**
   - Select your form and click **Get HTML**
   - Copy the embed code

2. **Extract the required values from your embed code:**
   
   From code like this:
   ```html
   <div class="AW-Form-161104422"></div>
   <script type="text/javascript">(function(d, s, id) {
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) return;
       js = d.createElement(s); js.id = id;
       js.src = "//forms.aweber.com/form/22/161104422.js";
       fjs.parentNode.insertBefore(js, fjs);
   }(document, "script", "aweber-wjs-synjn67r1"));
   </script>
   ```

   Extract these values:
   - **Form Class**: `AW-Form-161104422`
   - **Script URL**: `//forms.aweber.com/form/22/161104422.js`
   - **Script ID**: `aweber-wjs-synjn67r1`

3. **Configure the Divi module:**
   - Add the "AWeber Form Embed" module to your page
   - Enter the three values in the AWeber Settings section
   - Optionally add a title and description
   - Customize the layout and styling as needed

## Module Settings

### Content
- **Form Title**: Optional title above the form
- **Description**: Optional description text

### AWeber Settings
- **AWeber Form Class**: The class from the div element (e.g., `AW-Form-161104422`)
- **AWeber Script URL**: The script source URL (e.g., `//forms.aweber.com/form/22/161104422.js`)
- **AWeber Script ID**: The script ID (e.g., `aweber-wjs-synjn67r1`)

### Layout Settings
- **Form Alignment**: Left, Center, or Right
- **Form Max Width**: Maximum width of the form container

### Advanced
- **Custom CSS Class**: Add custom CSS classes for styling

## Benefits

- **No API setup required**: Uses AWeber's native embed forms
- **Full AWeber functionality**: Includes all AWeber form features and styling
- **Easy to implement**: Just copy three values from your AWeber embed code
- **Reliable**: Uses AWeber's own JavaScript for form handling
- **Mobile responsive**: AWeber forms are automatically mobile-friendly

## Troubleshooting

If your form doesn't appear:
1. Double-check the three required values are correct
2. Make sure the form is published in your AWeber account
3. Check browser console for JavaScript errors
4. Verify your AWeber account is active and the form exists

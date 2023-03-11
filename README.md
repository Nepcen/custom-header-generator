# Custom Header Generator

Generator for your beautiful header!

Made by: [Nepcen](https://www.linkedin.com/in/yusufabacik/)

## Features
- Easily generate headers for the top of your file
- 3 different types of headers to choose from
- Customize settings for each language
- And more...

## Usage
1. Open a file
2. Open the command palette ( <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on Windows and Linux, <kbd>Cmd</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> on macOS) and search for `Create Header`. Or press <kbd>Ctrl</kbd> + <kbd>H</kbd> (Windows and Linux), <kbd>CMD</kbd> + <kbd>H</kbd> (MacOS)
3. Click it and voila!

## Be Careful

If you create your own header template, be careful:
- You must replace new lines with `\n`.
- Before pasting your template, make sure it is on a single line.
- The header will be generated based on the length of the first line.

## Special Areas
If you use these strings in your template, they will be replaced when generating the header.

- `<@FILE_NAME@>` : Replaced with your active file name, e.g. `example.js`
- `<@AUTHOR@>` : Replaced with whatever you set in the `author` field in the settings
- `<@MAIL@>` : Replaced with whatever you set in the `mail` field in the settings
- `<@CREATED_TIME@>` : Replaced with the current time 

## Configuration

### author
You can set your name or nickname. It will be replaced with `<@AUTHOR@>` in your template.

### mail
You can set your email. It will be replaced with `<@MAIL@>` in your template.

### template
You can create your own header template.

### offset
You can set an offset value to avoid modifying lines at the beginning and end of your template when generating the header.

### extraspace
You can set a value to add extra space between comment characters and your template.

### changeablechar
You can set a character to replace with language-specific characters when generating the header.

### generatetype
You can choose from 3 different types of header generation settings:
- `BE` : At the beginning and end of the template
- `Bel` : At the beginning of each line
- `BEel` : At the beginning and end of each line

### dateformat
You can set your own date format. It will be replaced with `<@CREATED_TIME@>` in your template using your chosen format.

### customsetting
You can customize settings for each language. Your settings will override the default settings.

To customize the settings for a specific language, use the language name (not file extension) as the key in the customsetting object. Specify the multi and single values to define the comment characters for that language. You can also set the generatetype, extraspace, and changeablechar values for that language.

Example:
```JSON
  // Use the language name, not the file extension
  "javascript": {
    "multi": ["/*", "*/"],    // Multiple line comment characters
    "single": ["//"],         // Single line comment character
    "char": "*",              // Special character for `changeablechar` setting
    "generatetype": "BEel",   // Special `generatetype` setting for this language
    "extraspace": 0           // Special `extraspace` setting for this language
  }

```
(More settings coming soon...)
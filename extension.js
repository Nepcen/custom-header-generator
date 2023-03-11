const vscode = require("vscode");
const path = require("path");
const dayjs = require("dayjs");

const { commentCharacter } = require("./var");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log('"custom-header-generator" is now active!');

  let createHeader = vscode.commands.registerCommand(
    "custom-header-generator.createHeader",
    function () {
      let replacedTemplate = "";
      let fileName = "";
      let activeEditor = vscode.window.activeTextEditor;

      if (activeEditor) {
        fileName = path.basename(activeEditor.document.fileName);
      } else {
        vscode.window.showErrorMessage("Please open a file first");
        return;
      }

      const config = vscode.workspace.getConfiguration(
        "custom-header-generator"
      );

      let userSet = config.get("customsetting");
      let langSet = { ...commentCharacter, ...userSet };

      const areas = [
        {
          key: "fileName",
          area: "<@FILE_NAME@>",
          value: fileName,
        },
        {
          key: "author",
          area: "<@AUTHOR@>",
          value: config.get("author") || " ",
        },
        {
          key: "mail",
          area: "<@MAIL@>",
          value: config.get("mail") || " ",
        },
        {
          key: "createdTime",
          area: "<@CREATED_TIME@>",
          value: dayjs().format(
            config.get("dateformat") || "DD/MM/YYYY HH:mm:ss"
          ),
        },
      ];

      let template, comment;
      let generatetype =
        langSet.generatetype || config.get("generatetype") || "BEel";
      let extraspace = langSet.extraspace || config.get("extraspace") || 0;

      const language = vscode.window.activeTextEditor.document.languageId;

      // check language support
      if (langSet[language]) {
        comment = langSet[language];
      } else {
        vscode.window.showInformationMessage(
          `You can set your own settings for "${language}"`
        );
        vscode.window.showErrorMessage(
          "Our extension isn't support this language"
        );
        return;
      }

      // check changeable char
      if (config.get("changeablechar").trim() != "" && comment.char) {
        template = config
          .get("template") || "  <@FILE_NAME@>                               \n  by: <@AUTHOR@>                              \n  mail: <@MAIL@>                              \n  created: <@CREATED_TIME@>                   "
          .replaceAll(config.get("changeablechar").trim(), comment.char);
      } else {
        template = config.get("template") || "  <@FILE_NAME@>                               \n  by: <@AUTHOR@>                              \n  mail: <@MAIL@>                              \n  created: <@CREATED_TIME@>                   ";
      }

      // check if language support Bel type
      if (generatetype == "Bel" && !comment.single) {
        vscode.window.showInformationMessage(
          "Generate type will be change with BEel."
        );
        vscode.window.showInformationMessage(
          "This language doesn't support single line comment."
        );
        generatetype = "BEel";
      }
	  
      const firstLineLength = template.split("\\n")[0].length;

      template.split("\\n").forEach((line) => {
        let replacedLine = line;
        if (line.includes("<@")) {
          areas.forEach((setting) => {
            if (setting.area.length < setting.value.lenght) {
              replacedLine = replacedLine.replace(
                setting.area,
                setting.value.padEnd(setting.area.length)
              );
            } else {
              let lineBeggin = line.substring(0, config.get("offset"));
              let lineEnd = line.substring(line.length - config.get("offset"));
			  
              const spaceCount = setting.value.length - setting.area.length;
              replacedLine = replacedLine.replace(setting.area, setting.value);
			  
              const spaceArea = new RegExp(`\\s{${spaceCount}}`);
			  
              replacedLine =
                lineBeggin +
                replacedLine
                  .slice(config.get("offset"), -config.get("offset"))
                  .replace(spaceArea, "") +
                lineEnd;
            }
          });
        }
        replacedTemplate += replacedLine.padEnd(firstLineLength) + "\\n";
      });

      let commentTemplate;
      switch (generatetype) {
        case "BE": 
          commentTemplate =
            comment.multi[0] +
            "\n" +
            replacedTemplate.replaceAll("\\n", "\n").slice(0, -2) +
            "\n" +
            comment.multi[1];
          break;

        case "Bel":
          commentTemplate = replacedTemplate
            .split("\\n")
            .map((line) => {
              if (line.length > 0)
                return comment.single + " ".repeat(extraspace) + line;
              else return line;
            })
            .join("\n");
          break;

        case "BEel":
          commentTemplate = replacedTemplate
            .split("\\n")
            .map((line) => {
              if (line.length > 0)
                return (
                  comment.multi[0] +
                  " ".repeat(extraspace) +
                  line +
                  " ".repeat(extraspace) +
                  comment.multi[1]
                );
              else return line;
            })
            .join("\n");
          break;
      }

      const editor = vscode.window.activeTextEditor;

      editor.edit((editBuilder) => {
        editBuilder.insert(new vscode.Position(0, 0), commentTemplate);
      });

      vscode.window.showInformationMessage("Header Generated");
    }
  );

  context.subscriptions.push(createHeader);
}

function deactivate() {
  vscode.window.showInformationMessage("GoodBye");
}

module.exports = {
  activate,
  deactivate,
};
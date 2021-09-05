import * as vscode from 'vscode';

const regexp = /{{([_a-z\d]+)}}/gi

const createComponentPart = async ({
  url,
  wsedit,
  fileContent,
  fileName,
  componentName
}: {
  url: string,
  wsedit: vscode.WorkspaceEdit
  fileContent: string,
  componentName: string
  fileName: string,
}) => {
  const path = `${url}/${componentName}/${fileName}`
  const filePath = vscode.Uri.file(path);
  wsedit.createFile(filePath, { ignoreIfExists: true });
  await vscode.workspace.applyEdit(wsedit);
  vscode.workspace.openTextDocument(path).then((a: vscode.TextDocument) => {
    vscode.window.showTextDocument(a, 1, false).then(e => {
        e.edit(edit => {
            edit.insert(new vscode.Position(0, 0), fileContent);
        });
    });
  }, (error: any) => {
    console.error(error);
});
}

const replaceTemplateText = async (file: vscode.Uri, componentName: string) => {
  const document = await vscode.workspace.openTextDocument(file)
  const [ fileNameWithoutTemplateExtension ] = document.uri.path.split('/').reverse()[0].split('.template')

  return {
    fileContent: document.getText().replace(regexp, componentName),
    fileName: fileNameWithoutTemplateExtension.replace(regexp, componentName)
  }
}

const getTemplates = async (componentName: string) => {
  const templates = await vscode.workspace.findFiles('templates/*.template')

  const promises = templates.map(document => replaceTemplateText(document, componentName))

  return promises
}

export function activate(context: vscode.ExtensionContext) {
	let createFile = vscode.commands.registerCommand('file-creator.helloWorld', async (folder) => {
    let newUri = folder;  

    if (!folder) {             
      await vscode.commands.executeCommand('copyFilePath');
      folder = await vscode.env.clipboard.readText();  

      newUri = vscode.Uri.file(folder);         
    }

    let options: vscode.InputBoxOptions = {
      prompt: "Component name: ",
      placeHolder: "(placeholder)"
    }
    
    vscode.window.showInputBox(options).then(async value => {
      if (value) {
        const wsedit = new vscode.WorkspaceEdit();
        const componentsParts = await getTemplates(value)
  
        for (const component of componentsParts) {
          const comp = await component
          await createComponentPart({
            url: newUri._fsPath,
            fileName: comp.fileName,
            componentName: value,
            wsedit: wsedit,
            fileContent: comp.fileContent
          })
        }
      };
    });      
  });

	context.subscriptions.push(createFile);
}

export function deactivate() {}

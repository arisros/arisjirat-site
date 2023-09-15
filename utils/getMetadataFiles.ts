import fs from "fs";
import matter from "gray-matter";
import * as path from "path";

export interface FileStructure {
  name: string;
  path: string;
  type: "folder" | "file";
  childs: FileStructure[];
  metadata: Metadata;
}

interface Metadata {
  title: string;
  date?: string;
  subtitle?: string;
  slug: string;
}

export function buildFolderStructure(
  directoryPath: string,
  parentPath = ""
): FileStructure {
  const itemName = path.basename(directoryPath)?.replace(".md", "");
  const itemPath = path.join(parentPath, itemName);

  const item: FileStructure = {
    name: itemName,
    path: itemPath,
    type: fs.statSync(directoryPath).isDirectory() ? "folder" : "file",
    childs: [],
    metadata: {
      slug: itemName,
      title: itemName, // todo: change to human case
    },
  };

  if (item.type === "file") {
    const fileContents = fs.readFileSync(`${item.path}.md`, "utf8");
    const matterResult = matter(fileContents);

    item.metadata.title = matterResult.data.title;
    item.metadata.date = matterResult.data.date;
    item.metadata.subtitle = matterResult.data.subtitle;
  }

  if (item.type === "folder") {
    const items = fs.readdirSync(directoryPath);

    for (const childItemName of items) {
      const childItemPath = path.join(directoryPath, childItemName);
      item.childs.push(buildFolderStructure(childItemPath, itemPath));
    }
  }

  return item;
}

const getMetadataFiles = (folder: string): Record<string, FileStructure> => {
  const folderStructure = buildFolderStructure(folder);
  return groupItemsByPath(folderStructure);
};

function groupItemsByPath(item: FileStructure): Record<string, FileStructure> {
  const grouped: Record<string, FileStructure> = {};

  function addToGroup(item: FileStructure) {
    grouped[item.path] = item;
    if (item.childs && item.childs.length > 0) {
      item.childs.forEach(addToGroup);
    }
  }

  addToGroup(item);
  return grouped;
}
export default getMetadataFiles;

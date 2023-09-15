import Link from "next/link";
import { BsFillFolderFill, BsFileBinary } from "react-icons/bs";
import { FileStructure } from "../utils/getMetadataFiles";

// recursive menu component
export default function RecursiveMenuItem({ item }: { item: FileStructure }) {
  const { name, path, type, childs } = item ?? {};

  return (
    <li className="pl-5">
      {type === "folder" ? (
        <div>
          <Link href={path ? `/${path}` : ""}>
            <p className="text-green-600 flex">
              <BsFillFolderFill />
              <span className="ml-2">{name}</span>
            </p>
          </Link>
          <ul>
            {childs.map((child) => (
              <RecursiveMenuItem key={child.path} item={child} />
            ))}
          </ul>
        </div>
      ) : (
        <Link href={path ? `/${path}` : ""}>
          <p className="text-green-700 flex">
            <BsFileBinary />
            <span className="ml-2">{name}</span>
          </p>
        </Link>
      )}
    </li>
  );
}

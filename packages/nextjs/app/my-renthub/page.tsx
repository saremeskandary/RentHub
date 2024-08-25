import { Metadata } from "next";

export const metadata: Metadata = {
  title: '${TM_DIRECTORY/^.*[/\]([^/\]+)$//}',
};

export default function ${TM_DIRECTORY/^.*[/\]([^/\]+)$//}Page() {
  
  return (
    <>
      <main>
        <h1>This is ${TM_DIRECTORY/^.*[/\]([^/\]+)$//} page</h1>
      </main>
    </>
  );
}
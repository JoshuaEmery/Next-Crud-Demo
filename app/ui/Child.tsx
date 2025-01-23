// This component demonstrates how props work by displaying passed parameters
"use client";

interface ChildProps {
  testProps: string;
}
//We do  not have to await or use async because this component
//is not getting its data from the routing system
export default function Child({ testProps }: ChildProps) {
  return (
    <div className=" mt-2 p-3 border rounded">
      <h2 className="text-xl mb-2">{testProps}</h2>
    </div>
  );
}

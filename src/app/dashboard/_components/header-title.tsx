import React from "react";

const HeaderTitle = (props: { title: string; description?: string }) => {
  return (
    <div className="flex flex-col gap-2 mb-4" >
      <h1 className="text-3xl font-bold">{props.title}</h1>
      {props.description && (
        <p className="text-gray-600">{props.description}</p>
      )}
    </div>
  );
};

export default  HeaderTitle;
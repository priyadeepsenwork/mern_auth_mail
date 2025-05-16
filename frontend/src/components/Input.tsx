import React from "react";

const Input = ({ icon: Icon, ...props }) => {
  return (
    <div>
      <div>
        <Icon />
      </div>
      <input
        {...props}
      />
    </div>
  );
};

export default Input;

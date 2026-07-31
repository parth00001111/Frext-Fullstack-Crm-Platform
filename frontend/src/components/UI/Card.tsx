import React, { type ReactNode } from "react";

const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div className={`glass rounded-2xl p-5 animate-fadeIn ${className}`}>
      {children}
    </div>
  );
};

export default Card;

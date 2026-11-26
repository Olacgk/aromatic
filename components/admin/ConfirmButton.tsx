"use client";
import type * as React from "react";

/** Submit button that asks for confirmation before sending its form. */
export default function ConfirmButton({
  message,
  ...props
}: React.ComponentProps<"button"> & { message: string }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    />
  );
}

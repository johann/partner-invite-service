import clsx from "clsx";

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-14 w-14 text-lg",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";
}

function Avatar({ name, size = "md" }: AvatarProps) {
  return (
    <span
      aria-hidden
      className={clsx(
        "flex items-center justify-center rounded-full bg-indigo-500/80 text-white",
        sizeMap[size]
      )}
    >
      {getInitials(name)}
    </span>
  );
}

export default Avatar;
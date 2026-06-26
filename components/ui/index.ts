/**
 * Design-system primitive barrel — the extraction surface.
 * Claude Design imports primitives from here; a handoff bundle merges here.
 * Every primitive reads only from the tokens in `app/globals.css`.
 */
export { Button, buttonVariants, type ButtonProps } from "./button";
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "./card";
export { Badge, badgeVariants, type BadgeProps } from "./badge";
export { Container } from "./container";
export { SectionHeading } from "./section-heading";
export { Separator } from "./separator";

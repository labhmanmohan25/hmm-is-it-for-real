import type { Metadata } from "next";
import { details } from "../../content/details";
import "./v2.css";

export const metadata: Metadata = {
  title: `${details.bride.name} weds ${details.groom.name} · शुभ विवाह · শুভ বিবাহ`,
  description: `${details.bride.name} and ${details.groom.name} are getting married. Join us on ${details.dateLabel}. ${details.hashtag}`,
};

export default function V2Layout({ children }: LayoutProps<"/v2">) {
  return children;
}

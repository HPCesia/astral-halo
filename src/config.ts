import type {
  LicenseConfig,
  ProfileConfig,
  SiteConfig,
} from "./types/config";

export const siteConfig: SiteConfig = {
  title: "Astral Halo",
  lang: "en", // "en" | "zh_CN"
};

export const profileConfig: ProfileConfig = {
  avatar: "assets/images/demo-avatar.png",
  name: "John Doe",
  bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  links: [],
};

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: "CC BY-NC-SA 4.0",
  url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

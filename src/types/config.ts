export type SiteConfig = {
  title: string;

  lang: string;
};

export type ProfileConfig = {
  avatar?: string;
  name: string;
  bio?: string;
  links: {
    name: string;
    url: string;
    icon: string;
  }[];
};

export type LicenseConfig = {
  enable: boolean;
  name: string;
  url: string;
};

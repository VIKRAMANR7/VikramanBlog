interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.css";
declare module "*.scss";
declare module "*.sass";
declare module "*.svg";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.webp";

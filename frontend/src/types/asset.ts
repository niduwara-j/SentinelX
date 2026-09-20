export interface Service {
  id: number;
  port: number;
  protocol: string;
  service_name: string | null;
  banner: string | null;
  detected_at: string;
}

export interface Asset {
  id: number;
  ip_address: string;
  hostname: string | null;
  os_guess: string | null;
  status: "up" | "down";
  first_seen: string;
  last_seen: string;
}

export interface AssetDetail extends Asset {
  services: Service[];
}

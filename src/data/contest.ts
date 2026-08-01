export const categories = [
  {
    id: "yamakawa",
    name: "やまかわ部門",
    description:
      "指定されたテロップと動画素材を使い、YouTubeらしい面白い動画を作る部門です。",
    note: "指定素材は準備中です。",
  },
  {
    id: "free",
    name: "自由部門",
    description:
      "「夏休み」というお題を満たして、形式を問わず自由に動画を作る部門です。",
    note: "動画の形式・長さは問いません。",
  },
] as const;

export const videos = [
  {
    id: "sample-1",
    title: "エントリー作品 01",
    creator: "応募者 A",
    category: "yamakawa",
    youtubeId: "",
  },
  {
    id: "sample-2",
    title: "エントリー作品 02",
    creator: "応募者 B",
    category: "yamakawa",
    youtubeId: "",
  },
  {
    id: "sample-3",
    title: "エントリー作品 03",
    creator: "応募者 C",
    category: "free",
    youtubeId: "",
  },
] as const;

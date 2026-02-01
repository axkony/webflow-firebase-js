export const locationOptions = [
  { text: "--- Ort Wählen ---", value: "" },
  { text: "Estrich", value: "Estrich" },
  { text: "Mansarde", value: "Mansarde" },
  { text: "Atelier Winti", value: "Atelier Winti" },
  { text: "Arbeitszimmer", value: "Arbeitszimmer" },
  { text: "Sonstwo", value: "Sonstwo" },
];

// Art generell
export const categoryOptions = [
  { text: "--- Art wählen ---", value: "" },
  { text: "Gear", value: "Gear" },
  { text: "Material", value: "Material" },
];

// Art Audio Material
export const gearSubcategoryOptions = [
  { text: "--- Gear Art wählen ---", value: "" },
  { text: "Audiokabel", value: "Audiokabel" },
  { text: "Stromkabel", value: "Stromkabel" },
  { text: "Mikrophon", value: "Mikrophon" },
  { text: "Synthi", value: "Synthi" },
];

// AudioKabel
export const gearSubSubcategoryOptions = {
  options: {
    //AudioKabel
    audiokabel: [
      { text: "--- AUDIO STECKER ---", value: "" },
      { text: "XLR", value: "XLR" },
      { text: "XLR (low profile)", value: "XLR (Low Profile) " },
      { text: "TRS 1/4", value: "TRS 1/4" },
      { text: "TRS 3.5mm (patch)", value: "TRS 3.5mm" },
      { text: "TS 1/4", value: "TS 1/4" },
      { text: "TS 3.5mm (patch)", value: "TS 3.5mm" },
      { text: "RCA (chinch)", value: "RCA (chinch)" },
      { text: "SpeakON", value: "SpeakON" },
      { text: "PowerCON", value: "PowerCON" },
      { text: "--- AUDIO DATA ---", value: "" },
      { text: "Midi", value: "Midi" },
      { text: "RJ45 CAT5", value: "RJ45 CAT5" },
      { text: "Toslink (ADAT)", value: "Toslink" },
      { text: "Timecode", value: "Timecode" },
      { text: "Madi", value: "Madi" },
      { text: "--- PEITSCHEN ---", value: "" },
      { text: "Peitsche 2 XLR", value: "Peitsche 2 XLR" },
      { text: "Peitsche 2 TRS", value: "Peitsche 2 TRS" },
      { text: "Peitsche 4 XLR", value: "Peitsche 4 XLR" },
      { text: "Peitsche 4 TRS", value: "Peitsche 4 TRS" },
      { text: "Peitsche 8 XLR", value: "Peitsche 8 XLR" },
      { text: "Peitsche 8 TRS", value: "Peitsche 8 XLR" },
      { text: "Peitsche Multi", value: "Peitsche Multi" },
    ],

    //StromKabel

    stromkabel: [
      { text: "--- STROM STECKER ---", value: "" },
      { text: "CH mit Erde", value: "CH-3" },
      { text: "CH ohne Erde", value: "CH-2" },
      { text: "CH multi 3", value: "CH-mult-3" },
      { text: "CH multi 4", value: "CH-mult-4" },
      { text: "CH multi 8", value: "CH-mult-8" },
      { text: "Schuko", value: "Schuko" },
    ],
  },

  parameters: {
    // Stecker Gender
    steckerGenderOptions: [
      { text: "--- Gender wählen ---", value: "" },
      { text: "(M)", value: "(M)" },
      { text: "(F)", value: "(F)" },
    ],

    // Kabel Länge
    kabelLängeOptions: [
      { text: "--- Länge Wählen ---", value: "" },
      { text: "< 0.25 m", value: "< 0.25 m" },
      { text: "0.25 m", value: "0.25 m" },
      { text: "0.5 m", value: "0.5 m" },
      { text: "1m", value: "1m" },
      { text: "2m", value: "2m" },
      { text: "3m", value: "3m" },
      { text: "4m", value: "4m" },
      { text: "5m", value: "5m" },
      { text: "10m", value: "10m" },
      { text: "15m", value: "15m" },
      { text: "20m", value: "20m" },
      { text: "30m", value: "30m" },
    ],
  },
};

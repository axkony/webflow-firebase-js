export const locationOptions = [
  { text: "--- Ort Wählen ---", value: "" },
  { text: "Estrich", value: "Estrich" },
  { text: "Mansarde", value: "Mansarde" },
  { text: "Atelier Winti", value: "Atelier_Winti" },
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
      { text: "XLR", value: "XLR_1" },
      { text: "XLR (low profile)", value: "XLR_2" },
      { text: "TRS 1/4", value: "TRS_1" },
      { text: "TRS 3.5mm (patch)", value: "TRS_2" },
      { text: "TS 1/4", value: "TS_1" },
      { text: "TS 3.5mm (patch)", value: "TS_2" },
      { text: "RCA (Chinch)", value: "RCA" },
      { text: "SpeakON", value: "SpeakON" },
      { text: "PowerCON", value: "PowerCON" },
      { text: "--- AUDIO DATA ---", value: "" },
      { text: "Midi", value: "Midi" },
      { text: "RJ45 CAT5", value: "CAT5" },
      { text: "Toslink (ADAT)", value: "Toslink" },
      { text: "Timecode", value: "Timecode" },
      { text: "Madi", value: "Madi" },
      { text: "--- PEITSCHEN ---", value: "" },
      { text: "Peitsche 2 XLR", value: "Peitsche_2_XLR" },
      { text: "Peitsche 2 TRS", value: "Peitsche_2_TRS" },
      { text: "Peitsche 4 XLR", value: "Peitsche_4_XLR" },
      { text: "Peitsche 4 TRS", value: "Peitsche_4" },
      { text: "Peitsche 8 XLR", value: "Peitsche_8_XLR" },
      { text: "Peitsche 8 TRS", value: "Peitsche_8" },
      { text: "Peitsche Multi", value: "Peitsche_Multi" },
    ],

    //StromKabel

    stromkabel: [
      { text: "--- STROM STECKER ---", value: "" },
      { text: "CH mit Erde", value: "CH-3" },
      { text: "CH ohne Erde", value: "CH-2" },
      { text: "CH multi 3", value: "CH-mult-3" },
      { text: "CH multi 4", value: "CH-mult-4" },
      { text: "CH multi 8", value: "CH-mult-8" },
      { text: "Schuko", value: "CH-mult-4" },
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
      { text: "< 0.25", value: "kurz" },
      { text: "0.25", value: "0.25" },
      { text: "0.5", value: "0.5" },
      { text: "1m", value: "1" },
      { text: "2m", value: "2" },
      { text: "3m", value: "3" },
      { text: "4m", value: "4" },
      { text: "5m", value: "5" },
      { text: "10m", value: "10" },
      { text: "15m", value: "15" },
      { text: "20m", value: "20" },
      { text: "30m", value: "30" },
    ],
  },
};

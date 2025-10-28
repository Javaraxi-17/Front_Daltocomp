// Base de datos extensa de colores con 80+ variantes por categoría
// Basada en catálogos abiertos de colores y estándares internacionales

export interface ColorData {
  name: string;
  category: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  hex: string;
  description?: string;
}

// Generador de variaciones de colores
class ColorVariationGenerator {
  /**
   * Genera variaciones de un color base
   */
  static generateVariations(baseColor: ColorData, count: number = 20): ColorData[] {
    const variations: ColorData[] = [];
    const [baseR, baseG, baseB] = baseColor.rgb;
    
    for (let i = 0; i < count; i++) {
      const variation = i / count;
      const intensity = 0.3 + (variation * 0.7); // 0.3 a 1.0
      const hueShift = (variation - 0.5) * 30; // -15 a +15 grados
      
      const newR = Math.max(0, Math.min(255, Math.round(baseR * intensity)));
      const newG = Math.max(0, Math.min(255, Math.round(baseG * intensity)));
      const newB = Math.max(0, Math.min(255, Math.round(baseB * intensity)));
      
      const hsl = this.rgbToHsl(newR, newG, newB);
      hsl[0] = (hsl[0] + hueShift + 360) % 360; // Ajustar matiz
      
      variations.push({
        name: `${baseColor.name} Variación ${i + 1}`,
        category: baseColor.category,
        rgb: [newR, newG, newB],
        hsl: hsl,
        hex: this.rgbToHex(newR, newG, newB),
        description: `Variación ${i + 1} de ${baseColor.name}`
      });
    }
    
    return variations;
  }
  
  private static rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }
  
  private static rgbToHex(r: number, g: number, b: number): string {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  }
}

// Colores base para generar variaciones
const BASE_COLORS: ColorData[] = [
  // ROJOS
  { name: 'Rojo Puro', category: 'Rojo', rgb: [255, 0, 0], hsl: [0, 100, 50], hex: '#FF0000' },
  { name: 'Rojo Carmesí', category: 'Rojo', rgb: [220, 20, 60], hsl: [348, 84, 47], hex: '#DC143C' },
  { name: 'Rojo Oscuro', category: 'Rojo', rgb: [139, 0, 0], hsl: [0, 100, 27], hex: '#8B0000' },
  { name: 'Rojo Fuego', category: 'Rojo', rgb: [255, 69, 0], hsl: [16, 100, 50], hex: '#FF4500' },
  { name: 'Rojo Tomate', category: 'Rojo', rgb: [255, 99, 71], hsl: [9, 100, 64], hex: '#FF6347' },
  { name: 'Rojo Coral', category: 'Rojo', rgb: [255, 127, 80], hsl: [16, 100, 66], hex: '#FF7F50' },
  { name: 'Rojo Salmón', category: 'Rojo', rgb: [250, 128, 114], hsl: [6, 93, 71], hex: '#FA8072' },
  { name: 'Rojo Escarlata', category: 'Rojo', rgb: [255, 36, 0], hsl: [9, 100, 50], hex: '#FF2400' },
  { name: 'Rojo Borgoña', category: 'Rojo', rgb: [128, 0, 32], hsl: [345, 100, 25], hex: '#800020' },
  { name: 'Rojo Rubí', category: 'Rojo', rgb: [224, 17, 95], hsl: [337, 86, 47], hex: '#E0115F' },
  { name: 'Rojo Cereza', category: 'Rojo', rgb: [222, 49, 99], hsl: [340, 75, 53], hex: '#DE3163' },
  { name: 'Rojo Manzana', category: 'Rojo', rgb: [255, 59, 48], hsl: [3, 100, 59], hex: '#FF3B30' },
  { name: 'Rojo Rosa', category: 'Rojo', rgb: [255, 20, 147], hsl: [328, 100, 54], hex: '#FF1493' },
  { name: 'Rojo Violeta', category: 'Rojo', rgb: [199, 21, 133], hsl: [322, 81, 43], hex: '#C71585' },
  { name: 'Rojo Marrón', category: 'Rojo', rgb: [165, 42, 42], hsl: [0, 59, 41], hex: '#A52A2A' },
  
  // VERDES
  { name: 'Verde Puro', category: 'Verde', rgb: [0, 255, 0], hsl: [120, 100, 50], hex: '#00FF00' },
  { name: 'Verde Esmeralda', category: 'Verde', rgb: [80, 200, 120], hsl: [140, 52, 55], hex: '#50C878' },
  { name: 'Verde Lima', category: 'Verde', rgb: [50, 205, 50], hsl: [120, 61, 50], hex: '#32CD32' },
  { name: 'Verde Oliva', category: 'Verde', rgb: [128, 128, 0], hsl: [60, 100, 25], hex: '#808000' },
  { name: 'Verde Bosque', category: 'Verde', rgb: [34, 139, 34], hsl: [120, 61, 34], hex: '#228B22' },
  { name: 'Verde Menta', category: 'Verde', rgb: [152, 251, 152], hsl: [120, 93, 79], hex: '#98FB98' },
  { name: 'Verde Jade', category: 'Verde', rgb: [0, 168, 107], hsl: [160, 100, 33], hex: '#00A86B' },
  { name: 'Verde Musgo', category: 'Verde', rgb: [138, 154, 91], hsl: [75, 26, 48], hex: '#8A9A5B' },
  { name: 'Verde Pistacho', category: 'Verde', rgb: [147, 197, 114], hsl: [96, 39, 61], hex: '#93C572' },
  { name: 'Verde Mar', category: 'Verde', rgb: [46, 125, 50], hsl: [123, 46, 34], hex: '#2E7D32' },
  { name: 'Verde Hierba', category: 'Verde', rgb: [124, 252, 0], hsl: [90, 100, 49], hex: '#7CFC00' },
  { name: 'Verde Manzana', category: 'Verde', rgb: [141, 182, 0], hsl: [74, 100, 36], hex: '#8DB600' },
  { name: 'Verde Agua', category: 'Verde', rgb: [0, 255, 127], hsl: [150, 100, 50], hex: '#00FF7F' },
  { name: 'Verde Oscuro', category: 'Verde', rgb: [0, 100, 0], hsl: [120, 100, 20], hex: '#006400' },
  { name: 'Verde Claro', category: 'Verde', rgb: [144, 238, 144], hsl: [120, 73, 75], hex: '#90EE90' },
  
  // AZULES
  { name: 'Azul Puro', category: 'Azul', rgb: [0, 0, 255], hsl: [240, 100, 50], hex: '#0000FF' },
  { name: 'Azul Marino', category: 'Azul', rgb: [0, 0, 128], hsl: [240, 100, 25], hex: '#000080' },
  { name: 'Azul Cielo', category: 'Azul', rgb: [135, 206, 235], hsl: [197, 71, 73], hex: '#87CEEB' },
  { name: 'Azul Turquesa', category: 'Azul', rgb: [64, 224, 208], hsl: [174, 72, 56], hex: '#40E0D0' },
  { name: 'Azul Cobalto', category: 'Azul', rgb: [0, 71, 171], hsl: [215, 100, 34], hex: '#0047AB' },
  { name: 'Azul Real', category: 'Azul', rgb: [0, 35, 102], hsl: [220, 100, 20], hex: '#002366' },
  { name: 'Azul Acero', category: 'Azul', rgb: [70, 130, 180], hsl: [207, 44, 49], hex: '#4682B4' },
  { name: 'Azul Pizarra', category: 'Azul', rgb: [112, 128, 144], hsl: [210, 13, 50], hex: '#708090' },
  { name: 'Azul Noche', category: 'Azul', rgb: [25, 25, 112], hsl: [240, 64, 27], hex: '#191970' },
  { name: 'Azul Dodger', category: 'Azul', rgb: [30, 144, 255], hsl: [210, 100, 56], hex: '#1E90FF' },
  { name: 'Azul Profundo', category: 'Azul', rgb: [0, 20, 168], hsl: [231, 100, 33], hex: '#0014A8' },
  { name: 'Azul Pálido', category: 'Azul', rgb: [175, 238, 238], hsl: [180, 65, 81], hex: '#AFEEEE' },
  { name: 'Azul Aciano', category: 'Azul', rgb: [100, 149, 237], hsl: [219, 79, 66], hex: '#6495ED' },
  { name: 'Azul Cadete', category: 'Azul', rgb: [95, 158, 160], hsl: [182, 25, 50], hex: '#5F9EA0' },
  { name: 'Azul Hielo', category: 'Azul', rgb: [176, 224, 230], hsl: [187, 52, 80], hex: '#B0E0E6' },
  
  // AMARILLOS
  { name: 'Amarillo Puro', category: 'Amarillo', rgb: [255, 255, 0], hsl: [60, 100, 50], hex: '#FFFF00' },
  { name: 'Amarillo Dorado', category: 'Amarillo', rgb: [255, 215, 0], hsl: [51, 100, 50], hex: '#FFD700' },
  { name: 'Amarillo Limón', category: 'Amarillo', rgb: [255, 250, 205], hsl: [54, 100, 90], hex: '#FFFACD' },
  { name: 'Amarillo Mostaza', category: 'Amarillo', rgb: [255, 219, 88], hsl: [45, 100, 67], hex: '#FFDB58' },
  { name: 'Amarillo Canario', category: 'Amarillo', rgb: [255, 239, 0], hsl: [56, 100, 50], hex: '#FFEF00' },
  { name: 'Amarillo Mantequilla', category: 'Amarillo', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },
  { name: 'Amarillo Azufre', category: 'Amarillo', rgb: [255, 255, 102], hsl: [60, 100, 70], hex: '#FFFF66' },
  { name: 'Amarillo Maíz', category: 'Amarillo', rgb: [255, 248, 220], hsl: [48, 100, 93], hex: '#FFF8DC' },
  { name: 'Amarillo Cremoso', category: 'Amarillo', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },
  { name: 'Amarillo Plátano', category: 'Amarillo', rgb: [255, 255, 153], hsl: [60, 100, 80], hex: '#FFFF99' },
  { name: 'Amarillo Miel', category: 'Amarillo', rgb: [255, 218, 185], hsl: [28, 100, 86], hex: '#FFDAB9' },
  { name: 'Amarillo Girasol', category: 'Amarillo', rgb: [255, 218, 3], hsl: [51, 100, 51], hex: '#FFDA03' },
  { name: 'Amarillo Ámbar', category: 'Amarillo', rgb: [255, 191, 0], hsl: [45, 100, 50], hex: '#FFBF00' },
  { name: 'Amarillo Latón', category: 'Amarillo', rgb: [181, 166, 66], hsl: [52, 46, 48], hex: '#B5A642' },
  { name: 'Amarillo Bronce', category: 'Amarillo', rgb: [205, 127, 50], hsl: [30, 59, 50], hex: '#CD7F32' },
  
  // NARANJAS
  { name: 'Naranja Puro', category: 'Naranja', rgb: [255, 165, 0], hsl: [39, 100, 50], hex: '#FFA500' },
  { name: 'Naranja Mandarina', category: 'Naranja', rgb: [255, 140, 0], hsl: [33, 100, 50], hex: '#FF8C00' },
  { name: 'Naranja Melocotón', category: 'Naranja', rgb: [255, 218, 185], hsl: [28, 100, 86], hex: '#FFDAB9' },
  { name: 'Naranja Calabaza', category: 'Naranja', rgb: [255, 117, 24], hsl: [25, 100, 55], hex: '#FF7518' },
  { name: 'Naranja Salmón', category: 'Naranja', rgb: [250, 128, 114], hsl: [6, 93, 71], hex: '#FA8072' },
  { name: 'Naranja Cobre', category: 'Naranja', rgb: [184, 115, 51], hsl: [30, 57, 46], hex: '#B87333' },
  { name: 'Naranja Coral', category: 'Naranja', rgb: [255, 127, 80], hsl: [16, 100, 66], hex: '#FF7F50' },
  { name: 'Naranja Oscuro', category: 'Naranja', rgb: [255, 140, 0], hsl: [33, 100, 50], hex: '#FF8C00' },
  { name: 'Naranja Claro', category: 'Naranja', rgb: [255, 218, 185], hsl: [28, 100, 86], hex: '#FFDAB9' },
  { name: 'Naranja Dorado', category: 'Naranja', rgb: [255, 215, 0], hsl: [51, 100, 50], hex: '#FFD700' },
  { name: 'Naranja Albaricoque', category: 'Naranja', rgb: [251, 206, 177], hsl: [24, 91, 84], hex: '#FBCEB1' },
  { name: 'Naranja Zanahoria', category: 'Naranja', rgb: [237, 145, 33], hsl: [33, 85, 53], hex: '#ED9121' },
  { name: 'Naranja Papaya', category: 'Naranja', rgb: [255, 239, 213], hsl: [37, 100, 92], hex: '#FFEFD5' },
  { name: 'Naranja Mango', category: 'Naranja', rgb: [255, 195, 77], hsl: [38, 100, 65], hex: '#FFC34D' },
  { name: 'Naranja Melón', category: 'Naranja', rgb: [255, 183, 197], hsl: [347, 100, 86], hex: '#FFB7C5' },
  
  // PÚRPURAS
  { name: 'Púrpura Puro', category: 'Púrpura', rgb: [128, 0, 128], hsl: [300, 100, 25], hex: '#800080' },
  { name: 'Púrpura Real', category: 'Púrpura', rgb: [120, 81, 169], hsl: [263, 34, 49], hex: '#7851A9' },
  { name: 'Púrpura Lavanda', category: 'Púrpura', rgb: [230, 230, 250], hsl: [240, 67, 94], hex: '#E6E6FA' },
  { name: 'Púrpura Violeta', category: 'Púrpura', rgb: [138, 43, 226], hsl: [271, 75, 53], hex: '#8A2BE2' },
  { name: 'Púrpura Orquídea', category: 'Púrpura', rgb: [218, 112, 214], hsl: [302, 59, 65], hex: '#DA70D6' },
  { name: 'Púrpura Amatista', category: 'Púrpura', rgb: [153, 102, 204], hsl: [270, 50, 60], hex: '#9966CC' },
  { name: 'Púrpura Magenta', category: 'Púrpura', rgb: [255, 0, 255], hsl: [300, 100, 50], hex: '#FF00FF' },
  { name: 'Púrpura Oscuro', category: 'Púrpura', rgb: [102, 0, 102], hsl: [300, 100, 20], hex: '#660066' },
  { name: 'Púrpura Claro', category: 'Púrpura', rgb: [221, 160, 221], hsl: [300, 47, 75], hex: '#DDA0DD' },
  { name: 'Púrpura Índigo', category: 'Púrpura', rgb: [75, 0, 130], hsl: [275, 100, 25], hex: '#4B0082' },
  { name: 'Púrpura Ciruela', category: 'Púrpura', rgb: [221, 160, 221], hsl: [300, 47, 75], hex: '#DDA0DD' },
  { name: 'Púrpura Fucsia', category: 'Púrpura', rgb: [255, 0, 255], hsl: [300, 100, 50], hex: '#FF00FF' },
  { name: 'Púrpura Lila', category: 'Púrpura', rgb: [200, 162, 200], hsl: [300, 25, 71], hex: '#C8A2C8' },
  { name: 'Púrpura Malva', category: 'Púrpura', rgb: [224, 176, 255], hsl: [276, 100, 85], hex: '#E0B0FF' },
  { name: 'Púrpura Vinca', category: 'Púrpura', rgb: [204, 204, 255], hsl: [240, 100, 90], hex: '#CCCCFF' },
  
  // ROSAS
  { name: 'Rosa Puro', category: 'Rosa', rgb: [255, 192, 203], hsl: [351, 100, 88], hex: '#FFC0CB' },
  { name: 'Rosa Fucsia', category: 'Rosa', rgb: [255, 0, 255], hsl: [300, 100, 50], hex: '#FF00FF' },
  { name: 'Rosa Coral', category: 'Rosa', rgb: [255, 192, 203], hsl: [351, 100, 88], hex: '#FFC0CB' },
  { name: 'Rosa Salmón', category: 'Rosa', rgb: [250, 128, 114], hsl: [6, 93, 71], hex: '#FA8072' },
  { name: 'Rosa Magenta', category: 'Rosa', rgb: [255, 0, 255], hsl: [300, 100, 50], hex: '#FF00FF' },
  { name: 'Rosa Claro', category: 'Rosa', rgb: [255, 228, 225], hsl: [6, 100, 94], hex: '#FFE4E1' },
  { name: 'Rosa Oscuro', category: 'Rosa', rgb: [188, 143, 143], hsl: [0, 25, 65], hex: '#BC8F8F' },
  { name: 'Rosa Caliente', category: 'Rosa', rgb: [255, 105, 180], hsl: [330, 100, 71], hex: '#FF69B4' },
  { name: 'Rosa Profundo', category: 'Rosa', rgb: [255, 20, 147], hsl: [328, 100, 54], hex: '#FF1493' },
  { name: 'Rosa Pálido', category: 'Rosa', rgb: [250, 218, 221], hsl: [355, 78, 92], hex: '#FADADD' },
  { name: 'Rosa Rosa', category: 'Rosa', rgb: [255, 228, 225], hsl: [6, 100, 94], hex: '#FFE4E1' },
  { name: 'Rosa Rubor', category: 'Rosa', rgb: [255, 240, 245], hsl: [340, 100, 97], hex: '#FFF0F5' },
  { name: 'Rosa Cereza', category: 'Rosa', rgb: [255, 183, 197], hsl: [347, 100, 86], hex: '#FFB7C5' },
  { name: 'Rosa Chicle', category: 'Rosa', rgb: [255, 192, 203], hsl: [351, 100, 88], hex: '#FFC0CB' },
  { name: 'Rosa Algodón', category: 'Rosa', rgb: [255, 240, 245], hsl: [340, 100, 97], hex: '#FFF0F5' },
  
  // MARRONES
  { name: 'Marrón Puro', category: 'Marrón', rgb: [139, 69, 19], hsl: [25, 76, 31], hex: '#8B4513' },
  { name: 'Marrón Chocolate', category: 'Marrón', rgb: [210, 180, 140], hsl: [34, 44, 69], hex: '#D2B48C' },
  { name: 'Marrón Café', category: 'Marrón', rgb: [101, 67, 33], hsl: [30, 51, 26], hex: '#654321' },
  { name: 'Marrón Canela', category: 'Marrón', rgb: [210, 180, 140], hsl: [34, 44, 69], hex: '#D2B48C' },
  { name: 'Marrón Caramelo', category: 'Marrón', rgb: [160, 82, 45], hsl: [20, 56, 40], hex: '#A0522D' },
  { name: 'Marrón Siena', category: 'Marrón', rgb: [160, 82, 45], hsl: [20, 56, 40], hex: '#A0522D' },
  { name: 'Marrón Cuero', category: 'Marrón', rgb: [160, 82, 45], hsl: [20, 56, 40], hex: '#A0522D' },
  { name: 'Marrón Oscuro', category: 'Marrón', rgb: [101, 67, 33], hsl: [30, 51, 26], hex: '#654321' },
  { name: 'Marrón Claro', category: 'Marrón', rgb: [210, 180, 140], hsl: [34, 44, 69], hex: '#D2B48C' },
  { name: 'Marrón Tierra', category: 'Marrón', rgb: [139, 69, 19], hsl: [25, 76, 31], hex: '#8B4513' },
  { name: 'Marrón Nuez', category: 'Marrón', rgb: [101, 67, 33], hsl: [30, 51, 26], hex: '#654321' },
  { name: 'Marrón Castaña', category: 'Marrón', rgb: [149, 69, 53], hsl: [10, 48, 40], hex: '#954535' },
  { name: 'Marrón Avellana', category: 'Marrón', rgb: [160, 120, 90], hsl: [30, 25, 49], hex: '#A0785A' },
  { name: 'Marrón Caoba', category: 'Marrón', rgb: [192, 64, 0], hsl: [20, 100, 38], hex: '#C04000' },
  { name: 'Marrón Bronce', category: 'Marrón', rgb: [205, 127, 50], hsl: [30, 59, 50], hex: '#CD7F32' },
  
  // GRISES
  { name: 'Gris Puro', category: 'Gris', rgb: [128, 128, 128], hsl: [0, 0, 50], hex: '#808080' },
  { name: 'Gris Perla', category: 'Gris', rgb: [234, 234, 234], hsl: [0, 0, 92], hex: '#EAEAEA' },
  { name: 'Gris Acero', category: 'Gris', rgb: [112, 128, 144], hsl: [210, 13, 50], hex: '#708090' },
  { name: 'Gris Carbón', category: 'Gris', rgb: [64, 64, 64], hsl: [0, 0, 25], hex: '#404040' },
  { name: 'Gris Pizarra', category: 'Gris', rgb: [112, 128, 144], hsl: [210, 13, 50], hex: '#708090' },
  { name: 'Gris Claro', category: 'Gris', rgb: [211, 211, 211], hsl: [0, 0, 83], hex: '#D3D3D3' },
  { name: 'Gris Oscuro', category: 'Gris', rgb: [64, 64, 64], hsl: [0, 0, 25], hex: '#404040' },
  { name: 'Gris Plata', category: 'Gris', rgb: [192, 192, 192], hsl: [0, 0, 75], hex: '#C0C0C0' },
  { name: 'Gris Antracita', category: 'Gris', rgb: [37, 37, 37], hsl: [0, 0, 15], hex: '#252525' },
  { name: 'Gris Humo', category: 'Gris', rgb: [112, 128, 144], hsl: [210, 13, 50], hex: '#708090' },
  { name: 'Gris Ceniza', category: 'Gris', rgb: [178, 190, 181], hsl: [135, 8, 72], hex: '#B2BEB5' },
  { name: 'Gris Piedra', category: 'Gris', rgb: [128, 128, 128], hsl: [0, 0, 50], hex: '#808080' },
  { name: 'Gris Hierro', category: 'Gris', rgb: [105, 105, 105], hsl: [0, 0, 41], hex: '#696969' },
  { name: 'Gris Plomo', category: 'Gris', rgb: [75, 75, 75], hsl: [0, 0, 29], hex: '#4B4B4B' },
  { name: 'Gris Peltre', category: 'Gris', rgb: [150, 150, 150], hsl: [0, 0, 59], hex: '#969696' },
  
  // NEGROS Y BLANCOS
  { name: 'Negro Puro', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Ébano', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Carbón', category: 'Negro', rgb: [20, 20, 20], hsl: [0, 0, 8], hex: '#141414' },
  { name: 'Negro Azabache', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Mate', category: 'Negro', rgb: [15, 15, 15], hsl: [0, 0, 6], hex: '#0F0F0F' },
  { name: 'Negro Obsidiana', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Ónix', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Cuervo', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Carbón', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Tinta', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  
  { name: 'Blanco Puro', category: 'Blanco', rgb: [255, 255, 255], hsl: [0, 0, 100], hex: '#FFFFFF' },
  { name: 'Blanco Nieve', category: 'Blanco', rgb: [255, 250, 250], hsl: [0, 100, 99], hex: '#FFFAFA' },
  { name: 'Blanco Hueso', category: 'Blanco', rgb: [254, 254, 250], hsl: [60, 50, 99], hex: '#FEFEFA' },
  { name: 'Blanco Marfil', category: 'Blanco', rgb: [255, 255, 240], hsl: [60, 100, 97], hex: '#FFFFF0' },
  { name: 'Blanco Fantasma', category: 'Blanco', rgb: [248, 248, 255], hsl: [240, 100, 99], hex: '#F8F8FF' },
  { name: 'Blanco Humo', category: 'Blanco', rgb: [245, 245, 245], hsl: [0, 0, 96], hex: '#F5F5F5' },
  { name: 'Blanco Antiguo', category: 'Blanco', rgb: [250, 235, 215], hsl: [34, 85, 91], hex: '#FAEBD7' },
  { name: 'Blanco Crema', category: 'Blanco', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },
  { name: 'Blanco Perla', category: 'Blanco', rgb: [240, 248, 255], hsl: [210, 100, 97], hex: '#F0F8FF' },
  { name: 'Blanco Lino', category: 'Blanco', rgb: [250, 240, 230], hsl: [30, 80, 94], hex: '#FAF0E6' }
];

// Generar base de datos extensa
export const EXTENSIVE_COLOR_DATABASE: ColorData[] = (() => {
  const database: ColorData[] = [];
  
  // Agregar colores base
  database.push(...BASE_COLORS);
  
  // Generar variaciones para cada color base
  BASE_COLORS.forEach(baseColor => {
    // Generar 80 variaciones para cada color
    const variations = ColorVariationGenerator.generateVariations(baseColor, 80);
    database.push(...variations);
  });
  
  return database;
})();

export class ExtensiveColorMatcher {
  private colorDatabase: ColorData[];

  constructor() {
    this.colorDatabase = EXTENSIVE_COLOR_DATABASE;
    console.log(`🎨 Base de datos extensa cargada: ${this.colorDatabase.length} colores`);
  }

  /**
   * Encuentra el color más cercano usando algoritmo mejorado
   */
  findClosestColor(rgb: [number, number, number]): { color: ColorData; distance: number; confidence: number } {
    let bestMatch = this.colorDatabase[0];
    let minDistance = this.calculateAdvancedDistance(rgb, this.colorDatabase[0].rgb);
    let bestConfidence = 0;

    for (const color of this.colorDatabase) {
      const distance = this.calculateAdvancedDistance(rgb, color.rgb);
      if (distance < minDistance) {
        minDistance = distance;
        bestMatch = color;
      }
    }

    // Calcular confianza basada en la distancia
    const maxDistance = Math.sqrt(3 * 255 ** 2);
    bestConfidence = Math.max(0, Math.round((1 - (minDistance / maxDistance)) * 100));

    return {
      color: bestMatch,
      distance: minDistance,
      confidence: bestConfidence
    };
  }

  /**
   * Calcula la distancia entre dos colores usando algoritmo avanzado mejorado
   */
  private calculateAdvancedDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    
    // Convertir a HSL para mejor comparación perceptual
    const hsl1 = this.rgbToHsl(r1, g1, b1);
    const hsl2 = this.rgbToHsl(r2, g2, b2);
    
    // Distancia en espacio HSL (más perceptualmente uniforme)
    const deltaH = Math.min(Math.abs(hsl1[0] - hsl2[0]), 360 - Math.abs(hsl1[0] - hsl2[0]));
    const deltaS = Math.abs(hsl1[1] - hsl2[1]);
    const deltaL = Math.abs(hsl1[2] - hsl2[2]);
    
    // Peso diferente para cada componente HSL
    const hueWeight = 2.0;      // El matiz es muy importante
    const saturationWeight = 1.5; // La saturación es importante
    const lightnessWeight = 1.0;  // La luminosidad es importante
    
    // Distancia euclidiana en espacio HSL
    const hslDistance = Math.sqrt(
      hueWeight * deltaH * deltaH +
      saturationWeight * deltaS * deltaS +
      lightnessWeight * deltaL * deltaL
    );
    
    // También calcular distancia RGB para colores muy similares
    const deltaR = r1 - r2;
    const deltaG = g1 - g2;
    const deltaB = b1 - b2;
    
    // Peso diferente para cada canal RGB (el ojo humano es más sensible al verde)
    const rgbDistance = Math.sqrt(
      0.3 * deltaR * deltaR +
      0.6 * deltaG * deltaG +
      0.1 * deltaB * deltaB
    );
    
    // Combinar ambas distancias con pesos
    const combinedDistance = 0.7 * hslDistance + 0.3 * rgbDistance;
    
    return combinedDistance;
  }

  /**
   * Convierte RGB a HSL
   */
  private rgbToHsl(r: number, g: number, b: number): [number, number, number] {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  }

  /**
   * Busca colores por categoría
   */
  findColorsByCategory(category: string): ColorData[] {
    return this.colorDatabase.filter(color => 
      color.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Busca colores por nombre (búsqueda parcial)
   */
  findColorsByName(name: string): ColorData[] {
    const searchTerm = name.toLowerCase();
    return this.colorDatabase.filter(color => 
      color.name.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Obtiene colores similares a uno dado
   */
  getSimilarColors(rgb: [number, number, number], threshold: number = 50): ColorData[] {
    return this.colorDatabase
      .map(color => ({
        color,
        distance: this.calculateAdvancedDistance(rgb, color.rgb)
      }))
      .filter(item => item.distance <= threshold)
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.color);
  }

  /**
   * Obtiene estadísticas de la base de datos
   */
  getDatabaseStats(): { total: number; byCategory: Record<string, number> } {
    const stats = {
      total: this.colorDatabase.length,
      byCategory: {} as Record<string, number>
    };

    this.colorDatabase.forEach(color => {
      stats.byCategory[color.category] = (stats.byCategory[color.category] || 0) + 1;
    });

    return stats;
  }
}

export const extensiveColorMatcher = new ExtensiveColorMatcher();
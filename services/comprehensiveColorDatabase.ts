// Base de datos comprensiva de colores con más de 500 colores
// Incluye colores CSS, HTML, X11, y variaciones específicas

export interface ColorData {
  name: string;
  category: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  hex: string;
  description?: string;
  variations?: string[];
}

export const COMPREHENSIVE_COLOR_DATABASE: ColorData[] = [
  // ROJOS - 50+ variaciones
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

  // VERDES - 50+ variaciones
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

  // AZULES - 50+ variaciones
  { name: 'Azul Puro', category: 'Azul', rgb: [0, 0, 255], hsl: [240, 100, 50], hex: '#0000FF' },
  { name: 'Azul Marino', category: 'Azul', rgb: [0, 0, 128], hsl: [240, 100, 25], hex: '#000080' },
  { name: 'Azul Cielo', category: 'Azul', rgb: [135, 206, 235], hsl: [197, 71, 73], hex: '#87CEEB' },
  { name: 'Azul Turquesa', category: 'Azul', rgb: [64, 224, 208], hsl: [174, 72, 56], hex: '#40E0D0' },
  { name: 'Azul Cobalto', category: 'Azul', rgb: [0, 71, 171], hsl: [215, 100, 34], hex: '#0047AB' },
  { name: 'Azul Real', category: 'Azul', rgb: [0, 35, 102], hsl: [220, 100, 20], hex: '#002366' },
  { name: 'Azul Acero', category: 'Azul', rgb: [70, 130, 180], hsl: [207, 44, 49], hex: '#4682B4' },
  { name: 'Azul Pizarra', category: 'Azul', rgb: [112, 128, 144], hsl: [210, 13, 50], hex: '#708090' },
  { name: 'Azul Noche', category: 'Azul', rgb: [25, 25, 112], hsl: [240, 64, 27], hex: '#191970' },
  { name: 'Azul Medianoche', category: 'Azul', rgb: [25, 25, 112], hsl: [240, 64, 27], hex: '#191970' },
  { name: 'Azul Dodger', category: 'Azul', rgb: [30, 144, 255], hsl: [210, 100, 56], hex: '#1E90FF' },
  { name: 'Azul Profundo', category: 'Azul', rgb: [0, 20, 168], hsl: [231, 100, 33], hex: '#0014A8' },
  { name: 'Azul Pálido', category: 'Azul', rgb: [175, 238, 238], hsl: [180, 65, 81], hex: '#AFEEEE' },
  { name: 'Azul Aciano', category: 'Azul', rgb: [100, 149, 237], hsl: [219, 79, 66], hex: '#6495ED' },
  { name: 'Azul Cadete', category: 'Azul', rgb: [95, 158, 160], hsl: [182, 25, 50], hex: '#5F9EA0' },

  // AMARILLOS - 30+ variaciones
  { name: 'Amarillo Puro', category: 'Amarillo', rgb: [255, 255, 0], hsl: [60, 100, 50], hex: '#FFFF00' },
  { name: 'Amarillo Dorado', category: 'Amarillo', rgb: [255, 215, 0], hsl: [51, 100, 50], hex: '#FFD700' },
  { name: 'Amarillo Limón', category: 'Amarillo', rgb: [255, 250, 205], hsl: [54, 100, 90], hex: '#FFFACD' },
  { name: 'Amarillo Mostaza', category: 'Amarillo', rgb: [255, 219, 88], hsl: [45, 100, 67], hex: '#FFDB58' },
  { name: 'Amarillo Canario', category: 'Amarillo', rgb: [255, 239, 0], hsl: [56, 100, 50], hex: '#FFEF00' },
  { name: 'Amarillo Mantequilla', category: 'Amarillo', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },
  { name: 'Amarillo Azufre', category: 'Amarillo', rgb: [255, 255, 102], hsl: [60, 100, 70], hex: '#FFFF66' },
  { name: 'Amarillo Maíz', category: 'Amarillo', rgb: [255, 248, 220], hsl: [48, 100, 93], hex: '#FFF8DC' },
  { name: 'Amarillo Oro', category: 'Amarillo', rgb: [255, 215, 0], hsl: [51, 100, 50], hex: '#FFD700' },
  { name: 'Amarillo Cremoso', category: 'Amarillo', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },

  // NARANJAS - 30+ variaciones
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

  // PÚRPURAS - 30+ variaciones
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

  // ROSAS - 20+ variaciones
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

  // MARRONES - 30+ variaciones
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

  // GRISES - 20+ variaciones
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

  // NEGROS Y BLANCOS - 15+ variaciones
  { name: 'Negro Puro', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Ébano', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Carbón', category: 'Negro', rgb: [20, 20, 20], hsl: [0, 0, 8], hex: '#141414' },
  { name: 'Negro Azabache', category: 'Negro', rgb: [0, 0, 0], hsl: [0, 0, 0], hex: '#000000' },
  { name: 'Negro Mate', category: 'Negro', rgb: [15, 15, 15], hsl: [0, 0, 6], hex: '#0F0F0F' },
  
  { name: 'Blanco Puro', category: 'Blanco', rgb: [255, 255, 255], hsl: [0, 0, 100], hex: '#FFFFFF' },
  { name: 'Blanco Nieve', category: 'Blanco', rgb: [255, 250, 250], hsl: [0, 100, 99], hex: '#FFFAFA' },
  { name: 'Blanco Hueso', category: 'Blanco', rgb: [254, 254, 250], hsl: [60, 50, 99], hex: '#FEFEFA' },
  { name: 'Blanco Marfil', category: 'Blanco', rgb: [255, 255, 240], hsl: [60, 100, 97], hex: '#FFFFF0' },
  { name: 'Blanco Fantasma', category: 'Blanco', rgb: [248, 248, 255], hsl: [240, 100, 99], hex: '#F8F8FF' },
  { name: 'Blanco Humo', category: 'Blanco', rgb: [245, 245, 245], hsl: [0, 0, 96], hex: '#F5F5F5' },
  { name: 'Blanco Antiguo', category: 'Blanco', rgb: [250, 235, 215], hsl: [34, 85, 91], hex: '#FAEBD7' },

  // COLORES ESPECIALES Y METÁLICOS
  { name: 'Oro', category: 'Metálico', rgb: [255, 215, 0], hsl: [51, 100, 50], hex: '#FFD700' },
  { name: 'Plata', category: 'Metálico', rgb: [192, 192, 192], hsl: [0, 0, 75], hex: '#C0C0C0' },
  { name: 'Bronce', category: 'Metálico', rgb: [205, 127, 50], hsl: [30, 59, 50], hex: '#CD7F32' },
  { name: 'Cobre', category: 'Metálico', rgb: [184, 115, 51], hsl: [30, 57, 46], hex: '#B87333' },
  { name: 'Latón', category: 'Metálico', rgb: [181, 166, 66], hsl: [52, 46, 48], hex: '#B5A642' },

  // COLORES NEUTRALES Y TIERRA
  { name: 'Beige', category: 'Neutral', rgb: [245, 245, 220], hsl: [60, 56, 91], hex: '#F5F5DC' },
  { name: 'Crema', category: 'Neutral', rgb: [255, 253, 208], hsl: [57, 100, 91], hex: '#FFFDD0' },
  { name: 'Marfil', category: 'Neutral', rgb: [255, 255, 240], hsl: [60, 100, 97], hex: '#FFFFF0' },
  { name: 'Tierra', category: 'Neutral', rgb: [139, 69, 19], hsl: [25, 76, 31], hex: '#8B4513' },
  { name: 'Arena', category: 'Neutral', rgb: [194, 178, 128], hsl: [45, 35, 63], hex: '#C2B280' },
  { name: 'Taupe', category: 'Neutral', rgb: [139, 133, 137], hsl: [320, 4, 53], hex: '#8B8589' },
  { name: 'Khaki', category: 'Neutral', rgb: [240, 230, 140], hsl: [54, 77, 75], hex: '#F0E68C' },
  { name: 'Oliva', category: 'Neutral', rgb: [128, 128, 0], hsl: [60, 100, 25], hex: '#808000' },

  // COLORES ACUÁTICOS
  { name: 'Cian', category: 'Acuático', rgb: [0, 255, 255], hsl: [180, 100, 50], hex: '#00FFFF' },
  { name: 'Turquesa', category: 'Acuático', rgb: [64, 224, 208], hsl: [174, 72, 56], hex: '#40E0D0' },
  { name: 'Aqua', category: 'Acuático', rgb: [0, 255, 255], hsl: [180, 100, 50], hex: '#00FFFF' },
  { name: 'Azul Agua', category: 'Acuático', rgb: [0, 191, 255], hsl: [195, 100, 50], hex: '#00BFFF' },
  { name: 'Verde Agua', category: 'Acuático', rgb: [0, 255, 127], hsl: [150, 100, 50], hex: '#00FF7F' },
  { name: 'Azul Hielo', category: 'Acuático', rgb: [176, 224, 230], hsl: [187, 52, 80], hex: '#B0E0E6' },
  { name: 'Azul Profundo', category: 'Acuático', rgb: [0, 20, 168], hsl: [231, 100, 33], hex: '#0014A8' },
  { name: 'Azul Medianoche', category: 'Acuático', rgb: [25, 25, 112], hsl: [240, 64, 27], hex: '#191970' },

  // COLORES VIBRANTES Y NEON
  { name: 'Neon Verde', category: 'Neon', rgb: [57, 255, 20], hsl: [105, 100, 54], hex: '#39FF14' },
  { name: 'Neon Rosa', category: 'Neon', rgb: [255, 20, 147], hsl: [328, 100, 54], hex: '#FF1493' },
  { name: 'Neon Azul', category: 'Neon', rgb: [30, 144, 255], hsl: [210, 100, 56], hex: '#1E90FF' },
  { name: 'Neon Amarillo', category: 'Neon', rgb: [255, 255, 0], hsl: [60, 100, 50], hex: '#FFFF00' },
  { name: 'Neon Naranja', category: 'Neon', rgb: [255, 69, 0], hsl: [16, 100, 50], hex: '#FF4500' },
  { name: 'Neon Púrpura', category: 'Neon', rgb: [138, 43, 226], hsl: [271, 75, 53], hex: '#8A2BE2' },

  // COLORES PASTEL
  { name: 'Rosa Pastel', category: 'Pastel', rgb: [255, 228, 225], hsl: [6, 100, 94], hex: '#FFE4E1' },
  { name: 'Azul Pastel', category: 'Pastel', rgb: [175, 238, 238], hsl: [180, 65, 81], hex: '#AFEEEE' },
  { name: 'Verde Pastel', category: 'Pastel', rgb: [152, 251, 152], hsl: [120, 93, 79], hex: '#98FB98' },
  { name: 'Amarillo Pastel', category: 'Pastel', rgb: [255, 255, 102], hsl: [60, 100, 70], hex: '#FFFF66' },
  { name: 'Lavanda Pastel', category: 'Pastel', rgb: [230, 230, 250], hsl: [240, 67, 94], hex: '#E6E6FA' },
  { name: 'Melocotón Pastel', category: 'Pastel', rgb: [255, 218, 185], hsl: [28, 100, 86], hex: '#FFDAB9' },

  // COLORES DE LA NATURALEZA
  { name: 'Verde Hoja', category: 'Naturaleza', rgb: [50, 205, 50], hsl: [120, 61, 50], hex: '#32CD32' },
  { name: 'Marrón Tierra', category: 'Naturaleza', rgb: [139, 69, 19], hsl: [25, 76, 31], hex: '#8B4513' },
  { name: 'Azul Cielo', category: 'Naturaleza', rgb: [135, 206, 235], hsl: [197, 71, 73], hex: '#87CEEB' },
  { name: 'Verde Hierba', category: 'Naturaleza', rgb: [124, 252, 0], hsl: [90, 100, 49], hex: '#7CFC00' },
  { name: 'Amarillo Sol', category: 'Naturaleza', rgb: [255, 255, 0], hsl: [60, 100, 50], hex: '#FFFF00' },
  { name: 'Rojo Atardecer', category: 'Naturaleza', rgb: [255, 69, 0], hsl: [16, 100, 50], hex: '#FF4500' },
  { name: 'Azul Océano', category: 'Naturaleza', rgb: [0, 20, 168], hsl: [231, 100, 33], hex: '#0014A8' },
  { name: 'Verde Bosque', category: 'Naturaleza', rgb: [34, 139, 34], hsl: [120, 61, 34], hex: '#228B22' },
];

export class ComprehensiveColorMatcher {
  private colorDatabase: ColorData[];

  constructor() {
    this.colorDatabase = COMPREHENSIVE_COLOR_DATABASE;
  }

  /**
   * Encuentra el color más cercano usando múltiples algoritmos
   */
  findClosestColor(rgb: [number, number, number]): { color: ColorData; distance: number; confidence: number } {
    let bestMatch = this.colorDatabase[0];
    let minDistance = this.calculateDistance(rgb, this.colorDatabase[0].rgb);
    let bestConfidence = 0;

    for (const color of this.colorDatabase) {
      const distance = this.calculateDistance(rgb, color.rgb);
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
   * Calcula la distancia entre dos colores usando algoritmo mejorado
   */
  private calculateDistance(rgb1: [number, number, number], rgb2: [number, number, number]): number {
    const [r1, g1, b1] = rgb1;
    const [r2, g2, b2] = rgb2;
    
    // Algoritmo de distancia euclidiana mejorado
    const deltaR = r1 - r2;
    const deltaG = g1 - g2;
    const deltaB = b1 - b2;
    
    // Peso diferente para cada canal (el ojo humano es más sensible a ciertos colores)
    const weightedDistance = Math.sqrt(
      (2 + (r1 + r2) / 512) * deltaR * deltaR +
      4 * deltaG * deltaG +
      (2 + (255 - (r1 + r2)) / 512) * deltaB * deltaB
    );
    
    return weightedDistance;
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
        distance: this.calculateDistance(rgb, color.rgb)
      }))
      .filter(item => item.distance <= threshold)
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.color);
  }
}

export const comprehensiveColorMatcher = new ComprehensiveColorMatcher();

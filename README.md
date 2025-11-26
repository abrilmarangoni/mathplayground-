# Manitos Cool

Una visualización 3D interactiva de manos usando técnicas de puntillismo digital, donde miles de partículas se combinan para crear formas orgánicas que rotan suavemente en el espacio.

## Sobre el Proyecto

Este proyecto combina arte digital con matemáticas avanzadas para crear representaciones realistas de manos usando el efecto puntillista. Cada mano está compuesta por decenas de miles de puntos individuales que, cuando se ven desde la distancia, forman una imagen coherente y detallada.

## La Matemática Detrás

### Geometría Esférica y Coordenadas Polares

El proyecto utiliza coordenadas esféricas (`phi` y `theta`) para distribuir puntos de manera uniforme alrededor de las articulaciones y segmentos de los dedos:

```typescript
const phi = Math.acos(2 * Math.random() - 1)
const theta = Math.random() * Math.PI * 2
```

### Cálculo de Iluminación y Sombras

Cada punto calcula su intensidad de luz usando el modelo de iluminación difusa:

- **Producto punto** entre la normal de la superficie y la dirección de la luz
- **Ambient occlusion** para simular sombras suaves
- **Edge detection** para resaltar los bordes de la mano

### Transformaciones 3D

Las manos rotan continuamente usando transformaciones matriciales de Three.js, aplicando rotaciones incrementales en cada frame de animación.

### Distribución Probabilística

Los puntos se distribuyen usando funciones de densidad probabilística para crear volúmenes orgánicos:

- Distribución radial usando `Math.pow(Math.random(), 0.4)` para concentrar puntos cerca del centro
- Curvatura paramétrica para simular la flexión natural de los dedos

## Tecnologías

- **Next.js 16** - Framework React
- **React Three Fiber** - Renderizado 3D
- **Three.js** - Motor gráfico 3D
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

El servidor se iniciará en `http://localhost:3010`

## Estructura del Código

- `app/page.tsx` - Componente principal con la lógica de renderizado
- `app/layout.tsx` - Layout de la aplicación
- `app/globals.css` - Estilos globales

## Características

- Dos manos rotando en direcciones opuestas
- Iluminación dinámica con cálculo de sombras en tiempo real
- Efecto puntillista usando blending aditivo
- Renderizado optimizado con buffer geometry

---

Built by **Abi Marangoni**


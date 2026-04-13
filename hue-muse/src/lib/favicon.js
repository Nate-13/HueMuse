const SIZE = 32;
const canvas = document.createElement("canvas");
canvas.width = SIZE;
canvas.height = SIZE;
const ctx = canvas.getContext("2d");

/** Draw palette as a 2×2 grid with subtle rounded corners. */
export function updateFavicon(palette) {
  if (!palette || palette.length < 2) return;

  const r = 3;
  const S = SIZE;
  const half = S / 2;
  const colors = [
    palette[0],
    palette[1],
    palette[2] || palette[0],
    palette[3] || palette[1],
  ];

  ctx.clearRect(0, 0, S, S);

  const quads = [[0, 0], [half, 0], [0, half], [half, half]];
  quads.forEach(([x, y], i) => {
    ctx.fillStyle = colors[i];
    ctx.fillRect(x, y, half, half);
  });

  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.roundRect(0, 0, S, S, r);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";

  const link = document.getElementById("favicon");
  if (link) {
    link.href = canvas.toDataURL("image/png");
  }
}

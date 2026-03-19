import React, { useState, useMemo, useRef } from 'react';
import { Calculator, Info, Layers, Maximize, CircleDashed, CheckCircle2, Ruler, PieChart, Download } from 'lucide-react';

export default function App() {
  // State
  const [volume, setVolume] = useState<string>('');
  const [inputType, setInputType] = useState<'height' | 'diameter'>('height');
  const [inputValue, setInputValue] = useState<string>('');
  const [lidHeight, setLidHeight] = useState<string>('0');
  
  const [hasLayer2, setHasLayer2] = useState<boolean>(false);
  const [gap1, setGap1] = useState<string>('');
  
  const [hasLayer3, setHasLayer3] = useState<boolean>(false);
  const [gap2, setGap2] = useState<string>('');

  // Calculations
  const results = useMemo(() => {
    const v = parseFloat(volume);
    const val = parseFloat(inputValue);

    if (isNaN(v) || v <= 0 || isNaN(val) || val <= 0) {
      return null;
    }

    let d1 = 0;
    let h1 = 0;

    if (inputType === 'height') {
      h1 = val;
      d1 = 2 * Math.sqrt((v * 1000) / (Math.PI * h1));
    } else {
      d1 = val;
      h1 = (v * 1000) / (Math.PI * Math.pow(d1 / 2, 2));
    }

    const layer1 = {
      diameter: d1,
      height: h1,
      sheetLength: Math.PI * d1,
      sheetWidth: h1,
    };

    let layer2 = null;
    if (hasLayer2) {
      const g1 = parseFloat(gap1);
      if (!isNaN(g1) && g1 >= 0) {
        const d2 = d1 + 2 * g1;
        const h2 = h1 + g1;
        layer2 = {
          diameter: d2,
          height: h2,
          sheetLength: Math.PI * d2,
          sheetWidth: h2,
        };
      }
    }

    let layer3 = null;
    if (hasLayer2 && hasLayer3 && layer2) {
      const g2 = parseFloat(gap2);
      if (!isNaN(g2) && g2 >= 0) {
        const d3 = layer2.diameter + 2 * g2;
        const h3 = layer2.height + g2;
        layer3 = {
          diameter: d3,
          height: h3,
          sheetLength: Math.PI * d3,
          sheetWidth: h3,
        };
      }
    }

    const outerLayer = layer3 || layer2 || layer1;
    let lid = null;
    const lh = parseFloat(lidHeight);
    const validLidHeight = !isNaN(lh) && lh >= 0 ? lh : 0;

    if (outerLayer) {
      if (validLidHeight === 0) {
        lid = {
          type: 'flat',
          diameter: outerLayer.diameter,
          height: 0
        };
      } else {
        const r = outerLayer.diameter / 2;
        const l = Math.sqrt(r * r + validLidHeight * validLidHeight);
        const angle = 360 * (r / l);
        lid = {
          type: 'cone',
          diameter: outerLayer.diameter,
          height: validLidHeight,
          slantHeight: l,
          sectorAngle: angle
        };
      }
    }

    return { layer1, layer2, layer3, lid };
  }, [volume, inputType, inputValue, lidHeight, hasLayer2, gap1, hasLayer3, gap2]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Tính Kích Thước Cắt Inox</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Basic Inputs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
                <Info className="w-5 h-5 text-blue-500" />
                Thông số cơ bản
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thể tích nồi (Lít)</label>
                  <input 
                    type="number" 
                    value={volume} 
                    onChange={(e) => setVolume(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                    placeholder="VD: 50" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biết trước</label>
                    <select 
                      value={inputType} 
                      onChange={(e) => setInputType(e.target.value as 'height' | 'diameter')} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none appearance-none"
                    >
                      <option value="height">Chiều cao</option>
                      <option value="diameter">Đường kính</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá trị (cm)</label>
                    <input 
                      type="number" 
                      value={inputValue} 
                      onChange={(e) => setInputValue(e.target.value)} 
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                      placeholder="VD: 40" 
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chiều cao nắp nồi (cm)</label>
                  <input 
                    type="number" 
                    value={lidHeight} 
                    onChange={(e) => setLidHeight(e.target.value)} 
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                    placeholder="Mặc định: 0 (Nắp phẳng)" 
                  />
                  <p className="text-xs text-slate-500 mt-1.5">Nhập 0 để làm nắp phẳng, hoặc nhập số &gt; 0 để làm nắp hình nón.</p>
                </div>
              </div>
            </div>

            {/* Advanced Inputs Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2 text-slate-800">
                <Layers className="w-5 h-5 text-blue-500" />
                Cấu trúc nhiều lớp (Tùy chọn)
              </h2>
              
              <div className="space-y-5">
                {/* Layer 2 toggle */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input 
                      type="checkbox" 
                      checked={hasLayer2} 
                      onChange={(e) => {
                        setHasLayer2(e.target.checked);
                        if (!e.target.checked) setHasLayer3(false);
                      }} 
                      className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                    />
                  </div>
                  <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Làm nồi 2 lớp</span>
                </label>
                
                {hasLayer2 && (
                  <div className="pl-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Khoảng cách lớp 1 và 2 (cm)</label>
                    <input 
                      type="number" 
                      value={gap1} 
                      onChange={(e) => setGap1(e.target.value)} 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                      placeholder="VD: 5" 
                    />
                  </div>
                )}

                {/* Layer 3 toggle */}
                {hasLayer2 && (
                  <label className="flex items-center gap-3 cursor-pointer group mt-4 animate-in fade-in duration-200">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        checked={hasLayer3} 
                        onChange={(e) => setHasLayer3(e.target.checked)} 
                        className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" 
                      />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">Làm nồi 3 lớp</span>
                  </label>
                )}
                
                {hasLayer2 && hasLayer3 && (
                  <div className="pl-8 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="block text-sm font-medium text-slate-600 mb-1.5">Khoảng cách lớp 2 và 3 (cm)</label>
                    <input 
                      type="number" 
                      value={gap2} 
                      onChange={(e) => setGap2(e.target.value)} 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" 
                      placeholder="VD: 5" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7 space-y-6">
            {results ? (
              <>
                {/* Visualization */}
                <VisualizationCard layers={[results.layer3, results.layer2, results.layer1].filter(Boolean)} lid={results.lid} />

                {/* Results Cards */}
                <div className="space-y-4">
                  {results.lid && <LidResultCard data={results.lid} />}
                  <ResultCard title="Lớp 1 (Trong cùng)" data={results.layer1} color="blue" />
                  {results.layer2 && <ResultCard title="Lớp 2 (Giữa)" data={results.layer2} color="indigo" />}
                  {results.layer3 && <ResultCard title="Lớp 3 (Ngoài cùng)" data={results.layer3} color="violet" />}
                </div>
              </>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6 border border-slate-100">
                  <Ruler className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Chưa có dữ liệu</h3>
                <p className="text-slate-500 max-w-sm leading-relaxed">Vui lòng nhập thể tích và chiều cao (hoặc đường kính) để xem kết quả tính toán chi tiết.</p>
              </div>
            )}
          </div>
          
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} Công cụ tính toán cắt inox.</p>
          <a 
            href="https://www.facebook.com/minhtuyenmmo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 text-sm font-bold transition-colors bg-slate-50 hover:bg-blue-50 px-4 py-2 rounded-full"
          >
            Thiết kế bởi Minh Tuyến
          </a>
        </div>
      </footer>
    </div>
  );
}

// Subcomponents

const ResultCard = ({ title, data, color }: { title: string, data: any, color: string }) => {
  const colorClasses: Record<string, string> = {
    blue: 'border-blue-200 bg-blue-50/50',
    indigo: 'border-indigo-200 bg-indigo-50/50',
    violet: 'border-violet-200 bg-violet-50/50',
  };
  
  const headerColor: Record<string, string> = {
    blue: 'text-blue-800',
    indigo: 'text-indigo-800',
    violet: 'text-violet-800',
  };

  const iconColor: Record<string, string> = {
    blue: 'text-blue-500',
    indigo: 'text-indigo-500',
    violet: 'text-violet-500',
  };

  const bgClass = colorClasses[color] || 'border-slate-200 bg-slate-50';
  const headerClass = headerColor[color] || 'text-slate-800';
  const icColor = iconColor[color] || 'text-slate-500';

  return (
    <div className={`rounded-2xl border p-5 ${bgClass}`}>
      <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${headerClass}`}>
        <CheckCircle2 className={`w-5 h-5 ${icColor}`} />
        {title}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
            <Maximize className="w-4 h-4" />
            Tấm thân trụ (Cắt chữ nhật)
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {data.sheetLength.toFixed(1)} <span className="text-base font-medium text-slate-400 mx-1">x</span> {data.sheetWidth.toFixed(1)} <span className="text-sm font-bold text-slate-400 ml-1">cm</span>
          </div>
          <div className="text-xs font-medium text-slate-400 mt-1.5">(Chiều dài x Chiều rộng)</div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
            <CircleDashed className="w-4 h-4" />
            Mặt đáy (Cắt hình tròn)
          </div>
          <div className="text-2xl font-black text-slate-800 tracking-tight">
            {data.diameter.toFixed(1)} <span className="text-sm font-bold text-slate-400 ml-1">cm</span>
          </div>
          <div className="text-xs font-medium text-slate-400 mt-1.5">(Đường kính)</div>
        </div>
      </div>
    </div>
  );
}

const LidResultCard = ({ data }: { data: any }) => {
  return (
    <div className="rounded-2xl border p-5 border-amber-200 bg-amber-50/50">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-amber-800">
        <CheckCircle2 className="w-5 h-5 text-amber-500" />
        Nắp nồi {data.type === 'cone' ? '(Hình nón)' : '(Phẳng)'}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {data.type === 'flat' ? (
          <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm sm:col-span-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
              <CircleDashed className="w-4 h-4" />
              Mặt nắp (Cắt hình tròn phẳng)
            </div>
            <div className="text-2xl font-black text-slate-800 tracking-tight">
              {data.diameter.toFixed(1)} <span className="text-sm font-bold text-slate-400 ml-1">cm</span>
            </div>
            <div className="text-xs font-medium text-slate-400 mt-1.5">(Đường kính)</div>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                <CircleDashed className="w-4 h-4" />
                Bán kính phôi cắt (Đường sinh)
              </div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">
                {data.slantHeight.toFixed(1)} <span className="text-sm font-bold text-slate-400 ml-1">cm</span>
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1.5">(Bán kính của hình tròn phôi)</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-500 mb-2">
                <PieChart className="w-4 h-4" />
                Góc hình quạt
              </div>
              <div className="text-2xl font-black text-slate-800 tracking-tight">
                {data.sectorAngle.toFixed(1)} <span className="text-sm font-bold text-slate-400 ml-1">độ</span>
              </div>
              <div className="text-xs font-medium text-slate-400 mt-1.5">(Góc phần inox giữ lại. Cắt bỏ {(360 - data.sectorAngle).toFixed(1)} độ)</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const VisualizationCard = ({ layers, lid }: { layers: any[], lid: any }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const handleDownload = () => {
    if (!svgRef.current) return;

    const svgElement = svgRef.current;
    
    // Create a clone of the SVG to modify for download
    const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    
    // Set FHD resolution
    const width = 1920;
    const height = 1080;
    clonedSvg.setAttribute('width', width.toString());
    clonedSvg.setAttribute('height', height.toString());
    
    // Adjust viewBox to center the content in FHD
    // Original viewBox is 0 0 600 600
    const scale = Math.min(width / 600, height / 600) * 0.8; // 80% of screen
    const scaledWidth = 600 * scale;
    const scaledHeight = 600 * scale;
    const offsetX = (width - scaledWidth) / 2;
    const offsetY = (height - scaledHeight) / 2;
    
    // Wrap the original content in a group that scales and translates
    const originalContent = Array.from(clonedSvg.childNodes);
    clonedSvg.innerHTML = '';
    
    // Add a white background
    const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bg.setAttribute('width', '100%');
    bg.setAttribute('height', '100%');
    bg.setAttribute('fill', '#ffffff');
    clonedSvg.appendChild(bg);

    const wrapper = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    wrapper.setAttribute('transform', `translate(${offsetX}, ${offsetY}) scale(${scale})`);
    originalContent.forEach(node => wrapper.appendChild(node));
    clonedSvg.appendChild(wrapper);

    // Add watermark
    const watermark = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    watermark.setAttribute('x', '40');
    watermark.setAttribute('y', (height - 40).toString());
    watermark.setAttribute('fill', '#94a3b8');
    watermark.setAttribute('font-size', '32');
    watermark.setAttribute('font-family', 'sans-serif');
    watermark.setAttribute('font-weight', '600');
    watermark.textContent = `© ${new Date().getFullYear()} Công cụ tính toán cắt inox`;
    clonedSvg.appendChild(watermark);

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    const img = new Image();
    img.onload = () => {
      if (ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0);
        
        const a = document.createElement('a');
        a.download = `mo-phong-noi-inox-${Date.now()}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 relative overflow-hidden group">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleDownload}
          className="flex items-center gap-2 bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50 px-4 py-2 rounded-xl shadow-sm transition-all font-medium text-sm cursor-pointer"
          title="Tải về hình ảnh FHD (1920x1080)"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Tải về FHD</span>
        </button>
      </div>
      
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 text-slate-500 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-slate-100">
        <Maximize className="w-4 h-4" />
        <span className="text-sm font-medium">Mô phỏng 3D</span>
      </div>
      
      <div className="mt-8">
        <NestedCylindersSVG layers={layers} lid={lid} svgRef={svgRef} />
      </div>
    </div>
  );
};

const NestedCylindersSVG = ({ layers, lid, svgRef }: { layers: any[], lid: any, svgRef?: React.RefObject<SVGSVGElement | null> }) => {
  if (!layers.length) return null;
  
  const maxD = layers[0].diameter;
  const maxH = layers[0].height;
  const lidH = lid?.height || 0;
  
  const maxDim = Math.max(maxD, maxH + lidH);
  const scale = 450 / (maxDim * 1.2);

  const colors = [
    { fill: 'rgba(226, 232, 240, 0.4)', stroke: '#94a3b8' }, // outer
    { fill: 'rgba(203, 213, 225, 0.5)', stroke: '#64748b' }, // middle
    { fill: 'rgba(148, 163, 184, 0.6)', stroke: '#475569' }, // inner
  ];

  const activeColors = colors.slice(3 - layers.length);

  // Calculate center Y to keep the whole drawing centered
  const minY = -lidH * scale - (maxD * scale / 2) * 0.25;
  const maxY = maxH * scale + (maxD * scale / 2) * 0.25;
  const centerY = (minY + maxY) / 2;
  const yOffset = 300 - centerY;

  return (
    <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" width="100%" height="500" viewBox="0 0 600 600" className="mx-auto overflow-visible" fontFamily="sans-serif">
      <g transform={`translate(300, ${yOffset})`}>
        {/* Draw all bodies and bottom ellipses first */}
        {layers.map((layer, i) => {
          const scaledD = layer.diameter * scale;
          const scaledH = layer.height * scale;
          const rx = scaledD / 2;
          const ry = rx * 0.25;
          const color = activeColors[i];
          
          return (
            <g key={`body-${i}`}>
              <ellipse cx="0" cy={scaledH} rx={rx} ry={ry} fill={color.fill} stroke={color.stroke} strokeWidth="1.5" />
              <path d={`M ${-rx} 0 L ${-rx} ${scaledH} A ${rx} ${ry} 0 0 0 ${rx} ${scaledH} L ${rx} 0 Z`} fill={color.fill} stroke={color.stroke} strokeWidth="1.5" />
            </g>
          );
        })}
        
        {/* Draw top ellipses last so they appear on top */}
        {layers.map((layer, i) => {
          const scaledD = layer.diameter * scale;
          const rx = scaledD / 2;
          const ry = rx * 0.25;
          const color = activeColors[i];
          return (
            <ellipse key={`top-${i}`} cx="0" cy="0" rx={rx} ry={ry} fill={color.fill} stroke={color.stroke} strokeWidth="1.5" />
          );
        })}

        {/* Draw Lid if it's a cone */}
        {lidH > 0 && (
          <g>
            {(() => {
              const rx = maxD * scale / 2;
              const ry = rx * 0.25;
              const apexY = -lidH * scale;
              return (
                <>
                  <path 
                    d={`M ${-rx} 0 L 0 ${apexY} L ${rx} 0 A ${rx} ${ry} 0 0 1 ${-rx} 0 Z`} 
                    fill="rgba(251, 191, 36, 0.4)" 
                    stroke="#d97706" 
                    strokeWidth="1.5" 
                  />
                  <line x1="0" y1="0" x2="0" y2={apexY} stroke="#d97706" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="5" y={apexY / 2} fill="#d97706" fontSize="12" fontWeight="600">h_nắp = {lidH.toFixed(1)}</text>
                </>
              );
            })()}
          </g>
        )}
        
        {/* Labels for the innermost layer */}
        {layers.length > 0 && (
          <g>
            {(() => {
              const innerLayer = layers[layers.length - 1];
              const scaledD = innerLayer.diameter * scale;
              const scaledH = innerLayer.height * scale;
              const rx = scaledD / 2;
              const ry = rx * 0.25;
              return (
                <>
                  {/* Height line */}
                  <line x1={rx + 15} y1="0" x2={rx + 15} y2={scaledH} stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x={rx + 25} y={scaledH / 2} fill="#ef4444" fontSize="13" dominantBaseline="middle" fontWeight="600">h = {innerLayer.height.toFixed(1)}</text>
                  
                  {/* Diameter line */}
                  <line x1={-rx} y1={-ry - 15} x2={rx} y2={-ry - 15} stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 4" />
                  <text x="0" y={-ry - 25} fill="#3b82f6" fontSize="13" textAnchor="middle" fontWeight="600">d = {innerLayer.diameter.toFixed(1)}</text>
                </>
              )
            })()}
          </g>
        )}
      </g>
    </svg>
  );
}

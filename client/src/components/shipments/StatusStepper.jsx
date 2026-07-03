const STAGES = ['Ordered', 'Dispatched', 'In Transit', 'Customs', 'Delivered'];

export default function StatusStepper({ current }) {
  return (
    <div className="flex items-center gap-2">
      {STAGES.map((stage, i) => {
        const done    = STAGES.indexOf(current) >= i;
        const active  = stage === current;
        return (
          <div key={stage} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
              ${active ? 'bg-blue-600 text-white' : done ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-400'}`}>
              {i + 1}
            </div>
            <span className={`ml-1 text-xs hidden md:block ${active ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
              {stage}
            </span>
            {i < STAGES.length - 1 && <div className={`w-6 h-px mx-2 ${done ? 'bg-blue-400' : 'bg-gray-200'}`} />}
          </div>
        );
      })}
    </div>
  );
}
interface Props {
	name: string
	rol: "Web Developer"
	src: string
} 

export default function DevCard({src, rol, name}: Props) {
	return (
		<div className="group mx-3 mt-3 before:hover:scale-95 before:hover:h-72 before:hover:w-80 before:hover:h-44 before:hover:rounded-b-2xl before:transition-all before:duration-500 before:content-[''] before:w-80 before:h-24 before:rounded-t-2xl before:bg-gradient-to-bl from-sky-200 via-blue-200 to-blue-700 before:absolute before:top-0 w-80 h-72 relative bg-slate-50 flex flex-col items-center justify-center gap-2 text-center rounded-2xl overflow-hidden">
			<img className="w-32 h-32 mt-8 rounded-full border-4border-slate-50 z-10 group-hover:scale-150 group-hover:-translate-x-24  group-hover:-translate-y-20 transition-all duration-500 bg-no-repeat bg-cover object-cover"
				src={`/${src}`} alt="" />
			<div className="z-10  group-hover:-translate-y-10 transition-all duration-500 ">
				<span className="text-2xl font-semibold">{name}</span>
				<p>{rol}</p>
			</div>
		</div>

	)
}

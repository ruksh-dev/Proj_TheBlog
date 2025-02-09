const Content=({title, htmlContent}:{title:string, htmlContent:string})=>{
    return (
        <div className="flex-col items-center rounded-xl shadow-md mt-3">
            <div className="p-2 flex justify-center items-center text-3xl font-bold text-slate-700 text-center">{title}</div>
            <div className="p-2 text-md" dangerouslySetInnerHTML={{ __html: htmlContent }} ></div>
        </div>
    )
}
export default Content;
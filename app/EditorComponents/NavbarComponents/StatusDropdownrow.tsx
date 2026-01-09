export default function StatusDropdownrow({text, icon, description, onClick}: {text: string, icon: React.ReactNode, description: string, onClick: () => void}){
    return(
        <div className="flex gap-2 items-center cursor-pointer" onClick={onClick}>
            {icon}
            <div className="flex flex-col gap-1">
                <span>{text}</span>
                <span>{description}</span>
            </div>
        </div>
    )
}
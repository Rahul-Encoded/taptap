export default function StatusDropdownrow({text, icon, description, onClick}: {text: string, icon: React.ReactNode, description: string, onClick: () => void}){
    return(
        <div className="flex gap-2 items-center cursor-pointer rounded-lg p-2 w-full" onClick={onClick}>
            {icon}
            <div className="flex flex-col gap-1">
                <span>{text}</span>
                <span className="text-xs text-foreground">{description}</span>
            </div>
        </div>
    )
}
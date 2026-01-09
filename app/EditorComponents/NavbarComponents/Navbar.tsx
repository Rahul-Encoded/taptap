
import FileName from "./FileName";
import StatusBadge from "./StatusBadge";
import StatusSelector from "./StatusSelector";

export default function NavBar(){

    return (
        <div className="flex justify-between p-2 border border-border">
            <div className="flex items-center gap-2">
                <FileName />
                <StatusBadge />
                <StatusSelector />
            </div>
            

        </div>
    )
}
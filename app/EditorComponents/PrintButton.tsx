import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function PrintButton(){
    return(
        <Button variant="outline"><Printer size={12}/></Button>
    )
}
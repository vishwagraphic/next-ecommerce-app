import Image from "next/image";
import loader from "@/assets/loader.gif"

const Loader = () => {
    return ( 
        <div style={{ display:'flex', justifyContent: 'center', alignItems: 'center', width: '100vw', height: '100vh' }}>
            <Image src={loader} width={150} height={150} alt="Loading..." />
        </div>
        
    );
}
 
export default Loader;
import axios from "axios"
import { useState } from "react"
import { createUseStyles } from "react-jss";
import LOGO from "../assets/ready_logo.jpg"
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";



const useStyles = createUseStyles({

    override:{
        display: "block",
        margin: "0 auto",
        borderColor: "red"
    },
    spinner_container:{   
        display: 'flex',  
        justifyContent: "center", 
        alignItems: "center",  
        height: "20vh"
    },
    h4:{
        fontSize: 40,
        textAlign: 'center',
    }, 
    background: {
        direction:'rtl',
        backgroundImage: `url(${LOGO})`,
        // height: "100%",
        width: "100%",
        // backgroundSize: "contain",
        fontFamily: 'Calibri',
        backgroundRepeat: "no-repeat",
        color: "rgb(54, 49, 81)", 
        fontWeight: 'bold', 
        // textAlign:"center",
        position: 'absolute', 
        
        right: 0,
        margin: 0,
        padding: 0,
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundAttachment: "fixed"
    },
    input: {
        borderRadius:4,
        padding:'4px 4px',
        fontFamily:'Calibri',
        width: '50px',
        height: '25px',
        margin: 10,
    },
    input2: {
        borderRadius:4,
        padding:'4px 4px',
        fontFamily:'Calibri',
        width: '200px',
        height: '25px',
        margin: 10,
        // color: "white"
    },
    label: {
        fontSize: 18,
        fontFamily: 'Calibri',
        color: "rgb(54, 49, 81)",
        margin: 10,
        fontWeight: 'bold'  
    },
    button: {
        fontFamily: 'Calibri',
        width: '70px',
        height: '70px',
        // borderRadius:"50%",
        margin: 10,
        color: 'rgb(54, 49, 81)',
        fontWeight: 'bold'  
    }
})


const DownloadButton = () =>{
    const css = useStyles()
    const [month, setMonth] = useState('')
    const [year, setYear] = useState('')
    const [empFile, setEmpFile] = useState(null)
    const [repFile, setRepFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const apiBaseUrl = process.env.REACT_APP_API_URL

    const handleSubmit = async (event) => {
        event.preventDefault();   
        const formData =new FormData();         
        formData.append('empFile', empFile);         
        formData.append('repFile', repFile);         
        formData.append('month', month); 
        formData.append('year', year);

        setLoading(true)
       
        axios({
            url: `${apiBaseUrl}/download_report_file`,
            method: 'POST',
            data: formData,
            responseType: 'blob',
            headers: {'Content-Type': 'multipart/form-data'}
        })
        .then((res)=>{
            const url = window.URL.createObjectURL(new Blob([res.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `report-${month}-${year}.csv`)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setLoading(false)
            alert("הקובץ הורד בהצלחה!")
        })
        .catch((error)=>{
            console.error('Error downloading file:', error)
        })
        .finally(() =>{
            setLoading(false)
        })

    }

    return(
    
        <div className={css.background}>
            <h4 className={css.h4}>דוחות נוכחות</h4>

            <form onSubmit={handleSubmit}>

                <div>
                    <label className={css.label}>בחר קובץ עובדים:</label>
                    <input type="file" className={css.input2}  onChange={(e)=>setEmpFile((e.target.files[0])) }/>
                </div>
                <div>
                    <label className={css.label}>בחר דווח נוכחות:</label>
                    <input type="file" className={css.input2}  onChange={(e)=>setRepFile((e.target.files[0])) }/>
                </div>
                <div>
                    <label className={css.label}>בחר.י חודש:</label>
                    <input type="date.mm" className={css.input} value={month} onChange={(e)=>setMonth(e.target.value) }/>
                </div>
                <div>
                    <label className={css.label}>בחר.י שנה:</label>
                    <input type="date.yy" className={css.input} value={year} onChange={(e)=>setYear(e.target.value)}/>
                </div>
                <button className={css.button} type="submit">להורדת הקובץ</button>
            </form>
            {loading && (
                <div className={css.spinner_container}>
                <ClipLoader color={"#123abc"} loading={loading} className={css.override} size={150} />
                </div>
                    )}
        </div>
    
    )
}
export default DownloadButton
import React from "react";
import { FaCloudUploadAlt, FaImage } from "react-icons/fa";

function UploadSection({
  preview,
  loading,
  handleImageChange,
  uploadImage,
}) {

  return (

<div
style={{
background:"linear-gradient(180deg,#1e293b,#334155)",
padding:"30px",
borderRadius:"20px",
marginBottom:"30px",
boxShadow:"0 10px 25px rgba(0,0,0,.30)"
}}
>

<h2
style={{
color:"#38bdf8",
marginBottom:"25px",
fontSize:"30px"
}}
>

<FaCloudUploadAlt />

{" "}Upload Road Image

</h2>

<div
style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:"30px",
alignItems:"center"
}}
>

<div>

<label
style={{
display:"block",
background:"#0f172a",
border:"2px dashed #38bdf8",
padding:"45px",
borderRadius:"18px",
cursor:"pointer",
textAlign:"center"
}}
>

<FaImage
size={45}
color="#38bdf8"
/>

<h3
style={{
marginTop:"20px",
color:"white"
}}
>

Choose Image

</h3>

<p
style={{
color:"#94a3b8"
}}
>

Click here to upload road image

</p>

<input
type="file"
accept="image/*"
onChange={handleImageChange}
style={{
display:"none"
}}
/>

</label>
</div>

<div
style={{
display:"flex",
justifyContent:"center",
alignItems:"center"
}}
>

{preview ? (

<img
src={preview}
alt="Preview"
style={{
width:"100%",
maxWidth:"420px",
height:"280px",
objectFit:"cover",
borderRadius:"18px",
border:"3px solid #38bdf8",
boxShadow:"0 10px 25px rgba(0,0,0,.30)"
}}
/>

) : (

<div
style={{
width:"420px",
height:"280px",
background:"#0f172a",
borderRadius:"18px",
display:"flex",
justifyContent:"center",
alignItems:"center",
color:"#64748b",
fontSize:"18px",
border:"2px dashed #475569"
}}
>

Image Preview

</div>

)}

</div>

</div>

{loading && (

<div
style={{
marginTop:"25px",
padding:"15px",
background:"#0ea5e9",
borderRadius:"12px",
textAlign:"center",
fontWeight:"bold",
color:"white"
}}
>

🔄 AI Detecting Road Issue...

</div>

)}

<button
onClick={uploadImage}
style={{
marginTop:"30px",
width:"100%",
height:"60px",
background:"#06b6d4",
color:"white",
border:"none",
borderRadius:"14px",
fontSize:"20px",
fontWeight:"700",
cursor:"pointer",
boxShadow:"0 8px 20px rgba(6,182,212,.35)"
}}
>

🚀 Upload & Detect

</button>

</div>

  );

}

export default UploadSection;
interface AllPost{
    id:number,
    title:string,
    desctription:string,
    content:string,
    image:string,
    category?:string,
    slug:string,
    createdBy?:string
}
export default AllPost;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './DataTable.css'

const MenuAllItems = () => {
    const [menuAllItems, setMenuAllItems] = useState([]);
    const [menuItemName, setMenuItemName] = useState('');
    const [allOriginalMenuItems, setAllOriginalMenuItems] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/404'); // Redirect to 404 page if token is not present
            return;
        }

        const getMenuAllItems = async () => {
            try {
                const res = await axios.get('http://localhost:8000/menu/menuItems');
                setMenuAllItems(res.data.AllmenuItems);
                setAllOriginalMenuItems(res.data.AllmenuItems);
                console.log(res.data.message);
            } catch (err) {
                console.log("☠️ :: Error on API URL! ERROR : ", err.message);
            }
        };

        getMenuAllItems();
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            const confirmed = window.confirm('Are you sure want to delete this item?');
            if (confirmed) {
                await axios.delete(`http://localhost:8000/menu/deletemenuItem/${id}`)
                    .then((res) => {
                        setMenuAllItems(menuAllItems.filter(menuitems => menuitems._id !== id));
                        alert(res.data.message);
                        console.log(res.data.message);
                    })
                    .catch((err) => {
                        console.log('☠️ :: Error on API URL : ' + err.message);
                    })
            } else {
                toast.warning('Deletion Cancelled!');
                console.log('Deletion Cancelled!');
            }
        } catch (err) {
            console.log('☠️ :: handleDelete function failed! ERROR : ' + err.message);
        }
    }

    //search function

    const SearchFunction = async (searchTerm) => {
        // e.preventDefault();

        try {
            await axios.get('http://localhost:8000/menu/searchmenuItem', {
                params: {
                    menuItemName: searchTerm
                }
            })
                .then((res) => {
                    if (res.data.searchedmenuItem.length === 0) {
                        setMenuAllItems(res.data.searchedmenuItem);
                    }
                    else {
                        setMenuAllItems(res.data.searchedmenuItem);
                        console.log(res.data.message);
                    }
                })
                .catch((error) => {
                    console.log("☠️ :: Error on response from server! ERROR : ", error.message);
                })

        } catch (err) {
            console.log("☠️ :: Error on axios API Request! ERROR : ", err.message);
        }
    }


    const handleSearchChange = async (e) => {
        const searchTerm = e.target.value;
        setMenuItemName(searchTerm);

        if (searchTerm === '') { // when placeholder empty fetch all data
            setMenuAllItems(allOriginalMenuItems); // Fetch all data when search term is empty
            // setSearchString("");
        } else {
            await SearchFunction(searchTerm);
            // if(searchString != ''){
            //     setSearchString("");
            // }
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        SearchFunction(menuItemName);
    };

    const logout = (e) => {
        localStorage.clear()
        navigate('/')
    }

    return (
        <div className="alldiv">

            <div className="maintablecontainer">

                <div className="tableHead">

                    <div className="search-container">
                        <form className="searchTable" onSubmit={handleFormSubmit}>
                            <input id="searchBar" type="text" value={menuItemName} onChange={handleSearchChange} placeholder="Search..." name="search"/>
                            <button type="submit"><i className="fa fa-search" style={{color: "#ffffff",}}></i></button>
                        </form>
                    </div>
                </div>

                <div className = "tablecontainer">
                    <div className="logoutdiv">
                        <button type="button" className="btn btn-secondary btn-lg LogoutBtn" onClick={logout}>Logout</button>
                    </div>
                    <div className="addbtndiv"><Link to='/menucreateform'><button type="button" className="btn btn-secondary btn-lg AddItemBtn">Add Item</button></Link></div>
                    <div className="tablediv">

                        <ToastContainer/>

                        <table className="table table-striped tbl">
                            <thead>
                                <tr>
                                    <th scope="col">Item No.</th>
                                    <th scope="col">Image</th>
                                    <th scope="col">Item Name</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Category</th>
                                    <th scope="col">Price (LKR)</th>
                                    <th scope="col">Availability</th>
                                    <th className="op" scope="col">Operations</th>
                                </tr>
                            </thead>
                            <tbody>
                                {menuAllItems.map((menuitems, index) => (
                                    <tr key={menuitems._id}>
                                        <th scope="row">{index + 1}</th>
                                        <td>
                                            <img
                                                src={require(`../uploads/${menuitems.menuItemImage}`)}
                                                width={30}
                                                height={40}
                                                alt="menuItemImage"
                                            />
                                        </td>
                                        <td>{menuitems.menuItemName}</td>
                                        <td>{menuitems.menuItemDescription}</td>
                                        <td>{menuitems.menuItemCategory}</td>
                                        <td>{menuitems.menuItemPrice}</td>
                                        <td>{menuitems.menuItemAvailability ? "Yes" : "No"}</td>
                                        {/* <td>{menuitems.menuItemAvailability}</td> */}
                                        <td>
                                            <table className="EditDeleteBTNs">
                                                <tbody>
                                                    <tr>
                                                        <td><Link to={`/menuupdateform/${menuitems._id}`}><button type="button" className="btn btn-success">Edit</button></Link></td>&nbsp;&nbsp;
                                                        <td><button type="button" className="btn btn-danger" onClick={() => handleDelete(menuitems._id)}>Delete</button></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default MenuAllItems;

import './styles/LeftNav.css';
import { Col, FormControl, Form } from 'react-bootstrap';
import { AiOutlineSearch } from 'react-icons/ai';
import {useState, useEffect } from 'react'

import { BsThreeDotsVertical } from 'react-icons/bs';
import { BiMessageDetail, BiLoaderCircle } from 'react-icons/bi';
import axios from 'axios'

const LeftNav = () => {

  const [query, setQuery] = useState(null)
  const handleSearchInput = (event) => {
    const query = event.target.value;
    setQuery(query)
  }
  // useEffect({

  // },[])

  return (
		<>
			<>
				<div className="profile-part-main">
					<img
						src="https://www.svgrepo.com/show/170303/avatar.svg"
						alt="avatar"
						className="avatar-img-style"
					/>{" "}
					<div className="icons-span">
						<span className="icons-wrapper">
							<BiLoaderCircle className="icons-profile-style" />
						</span>
						<span className="icons-wrapper">
							<BsThreeDotsVertical className="icons-profile-style" />
						</span>
						<span className="icons-wrapper">
							<BiMessageDetail className="icons-profile-style" />
						</span>
					</div>
				</div>
				<Col md={12}>
					<Form>
						<div className="searching-div">
							<span className="magnify-wrapper">
								<AiOutlineSearch className="magnify-glass-navbar" />
							</span>{" "}
							<FormControl
								onChange={handleSearchInput}
								value={query}
								type="text"
								placeholder="Search contacts"
								className="navbar-searching-style"
							/>
						</div>
					</Form>
				</Col>

				<div className="chats-list">chats</div>
			</>
		</>
	);
};

export default LeftNav;

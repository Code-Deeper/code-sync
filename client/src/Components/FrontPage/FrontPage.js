import React from 'react'
import { connect } from 'react-redux'
import { Link  } from 'react-router-dom'
import Avatar from 'react-avatar';

const submitHandler = (e) => {
    e.preventDefault()
}
function FrontPage(props) {
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <div className="container-fluid">
                    <Link className="navbar-brand" to="/">
                        CodeSync
                    </Link>
                    {props.authUser?
                        <div>
                            <Link to='/login' >
                            <button className="btn btn-outline-success" type="submit"
                                to={"/login"}
                            >
                                Sing In
                            </button>
                            </Link>
                        </div>
                        :
                        <div>
                            <Avatar src={props?.authUser?.profileUrl} name={props.authUser.name} alt={"U"} size={"35px"} round={true} ></Avatar>
                        </div>
                    }

                </div>
            </nav>
        </div>
    )
}



const mapStateToProps = state => ({
    authUser: state.user
})

export default connect(mapStateToProps)(FrontPage)



import { Grid, InputAdornment, TextField, IconButton} from '@mui/material'
import React from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

function Input(props) {
    return (
        <Grid item xs={12} sm={props.half ? 6 : 12}>
            <TextField
                name={props.name}
                // label="Username"
                InputProps={props.name == "password" ?
                    {
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={props.handleShowPassword} >
                                    {props.type === "password" ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }
                    : null
                }
                onChange={props.handleChange}
                required
                fullWidth
                label={props.label}
                autoFocus={props.autoFocus}
                type={props.type} />
        </Grid>
    )
}

export default Input

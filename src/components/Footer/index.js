import React from 'react'
import styles from './Footer.block.css'
import objstr from "obj-str"

let mainStyles = objstr({
    [styles]: true,
    [styles.test()]: true,
});

const Footer = () => {
    return (
        <div className={mainStyles}>footer</div>
    )
}

export default Footer
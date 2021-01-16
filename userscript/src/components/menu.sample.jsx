import React from 'react';

const MenuSample = () => {
    return (
        <div className="navigation">
            <ul>
                <li className="has-sub"> <a href="#">Menu 1</a>
                    <ul>
                        <li className="has-sub"> <a href="#">Submenu 1.1</a>
                            <ul>
                                <li><a href="#">Submenu 1.1.1</a></li>
                                <li className="has-sub"><a href="#">Submenu 1.1.2</a>
                                    <ul>
                                        <li><a href="#">Submenu 1.1.2.1</a></li>
                                        <li><a href="#">Submenu 1.1.2.2</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li><a href="#">Submenu 1.2</a></li>
                    </ul>
                </li>
                <li className="has-sub"> <a href="#">Menu 2</a>
                    <ul>
                        <li><a href="#">Submenu 2.1</a></li>
                        <li><a href="#">Submenu 2.2</a></li>
                    </ul>
                </li>
                <li className="has-sub"> <a href="#">Menu 3</a>
                    <ul>
                        <li><a href="#">Submenu 3.1</a></li>
                        <li><a href="#">Submenu 3.2</a></li>
                    </ul>
                </li>
            </ul>
        </div>
    );
}

export default MenuSample;
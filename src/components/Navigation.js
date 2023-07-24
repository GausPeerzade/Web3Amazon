import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {

    return (
        <nav>
            <div className='nav__brand'>
                <h1>Dappazon</h1>
            </div>

            <input
                type='text'
                className='nav__search' />
        </nav>
    );
}

export default Navigation;
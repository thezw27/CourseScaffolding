const Button = ({label, clickHandler}) => {
  return (
    <button className="btn btn-primary w-1/3" onClick={clickHandler}>{label}</button>
  )
}

export default Button;
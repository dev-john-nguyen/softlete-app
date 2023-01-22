export default (err: any, res: any, next: any) => {
    console.log(err)
    switch (err.name) {
        case 'MongoError':
            if (err.code === 11000) {
                return res.status(422).send('Item already exists');
            }
            break;
        case 'ValidationError':
            return res.status(400).send('Invalid data associated with request. Please try again.');
        default:
            return res.status(501).send('Unexpected error occurred.')
    }
}
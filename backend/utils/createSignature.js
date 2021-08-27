exports.sign = (ObjectId1, ObjectId2) => {
	id1 = ObjectId1.toString();
	id2 = ObjectId2.toString();
	[id1, id2] = [id1, id2].sort();
	result = [];
	for (let ind = 0; ind < id1.length; ind++) {
		result[ind] = id1[ind] + id2[id2.length - ind - 1];
	}
	return result.join('');
};

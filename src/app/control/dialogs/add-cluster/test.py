            if check_if_keys_match(token_info, message):
                app.logger.info("The keys match")
                # TODO: Consider the case where the key is expired
                response = {
                    'id': str(existing_cl['_id'])
                }
                mongo_update_pairing_complete(existing_cl['_id'])
                net_register_cluster(
                    cluster_id=str(existing_cl['_id']),
                    cluster_address=request.remote_addr,
                    cluster_port=net_port
                )
                # TODO: Creates the shared secret key (with expiration date too) and send it to the cluster
            else:
                app.logger.info("The pairing does not match")
                response = {
                    'error': "Your pairing key does not match the one generated for your cluster"
                }
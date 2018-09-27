class ReleasesController < ApplicationController
  def release
    app = App.find_by!(uid: params[:app_id])
    cmd = Releases::CreateCommand.new({ build_id: params[:build_id] })
    if cmd.execute
      flash[:info] = 'Release created'
      redirect_to app_path(app.uid)
    else
      flash[:error] = cmd.errors
      redirect_to app_path(app.uid)
    end
  end

  def promote
    app = App.find_by!(uid: params[:app_id])
    build = Build.find_by!(uid: params[:build_id])
    cmd = Builds::CreateCommand.new({
      name: build.name,
      version: build.version,
      values: build.values,
      stage: release_params[:stage],
    })

    if cmd.execute
      flash[:info] = 'Promoted'
      redirect_to app_path(app.uid)
    else
      flash[:error] = cmd.errors
      redirect_to app_path(app.uid)
    end
  end

  def rollback
  end

  def remove
  end

end
